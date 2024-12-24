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
        {
          message: 'Invalid content type',
          error: 'Expected application/json',
        },
        { status: 400 },
      );
    }

    // Parse raw body text
    const body = await request.text();

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        {
          message: 'Invalid JSON',
          error: String(parseError),
        },
        { status: 400 },
      );
    }

    // Validate data with more lenient schema
    try {
      const validatedData = SensorDataSchema.parse(data);

      latestSensorData = {
        temperature: validatedData.temperature ?? 0, // Provide default values for missing properties
        voltage: validatedData.voltage ?? 0,
        current: validatedData.current ?? 0,
        power: validatedData.power ?? 0,
        relayState: validatedData.relayState ?? false,
        temperatureThreshold: validatedData.temperatureThreshold ?? 0,
        lastUpdated: new Date(),
      };

      // Store or process validated data

      return NextResponse.json(
        {
          message: 'Sensor data received successfully',
          data: validatedData,
        },
        { status: 200 },
      );
    } catch (validationError) {
      console.error('Data validation error:', validationError);
      return NextResponse.json(
        {
          message: 'Invalid sensor data',
          error: validationError instanceof z.ZodError ? validationError.errors : 'Unknown validation error',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json(
      {
        message: 'Server error processing sensor data',
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(latestSensorData);
}
