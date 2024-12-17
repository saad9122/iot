// app/api/sensors/route.ts
import db from '@/db/db';
import { sensorDataSchema } from '@/util/validationSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

interface ILatestSensorData {
  temperature: Number;
  voltage: number;
  current: number;
  power: number;
  relayState: boolean;
  temperatureThreshold: number;
  lastUpdated: Date;
}

// In a real app, you'd use a database
let latestSensorData: ILatestSensorData = {
  temperature: 0,
  voltage: 0,
  current: 0,
  power: 0,
  relayState: false,
  temperatureThreshold: 25.0,
  lastUpdated: new Date(),
};

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Invalid content type', error: 'Expected application/json' },
        { status: 400 },
      );
    }

    const body = await request.text();

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({ message: 'Invalid JSON', error: parseError.message }, { status: 400 });
    }

    try {
      // Validate incoming data using Yup schema
      const validatedData = await sensorDataSchema.validate(data, { abortEarly: false });

      // Find the device by MAC address
      const device = await db.device.findUnique({
        where: { macAddress: validatedData.macAddress },
      });

      console.log('device data', device.id);

      if (!device) {
        return NextResponse.json(
          { message: 'Device not found', error: 'No device found with the given MAC address' },
          { status: 404 },
        );
      }

      // Write the sensor reading to the database

      console.log('power', validatedData.power);
      const updatedReading = await db.sensorReading.create({
        data: {
          deviceId: device.id.toString(),
          temperature: validatedData.temperature,
          voltage: validatedData.voltage,
          current: validatedData.current,
          power: validatedData.power?.realPower,
        },
      });

      // Update the device's last activity timestamp and mark it as active
      await db.device.update({
        where: { id: device.id },
        data: {
          lastActivityAt: new Date(), // Update last activity time
        },
      });

      return NextResponse.json(
        {
          message: 'Sensor data processed successfully',
          reading: updatedReading,
        },
        { status: 200 },
      );
    } catch (validationError) {
      console.error('Data validation error:', validationError);
      return NextResponse.json(
        {
          message: 'Invalid sensor data',
          error: validationError.errors || 'Unknown validation error',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ message: 'Server error processing sensor data', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(latestSensorData);
}
