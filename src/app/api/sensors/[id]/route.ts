import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';
import { sensorDataSchema } from '@/util/validationSchema';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = params.id;

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

    let validatedData;
    try {
      validatedData = await sensorDataSchema.validate(data, { abortEarly: false });
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

    await db.sensorReading.create({
      data: {
        deviceId: deviceId,
        temperature: validatedData.temperature,
        voltage: validatedData.voltage,
        current: validatedData.current,
        power: validatedData.power?.Power,
      },
    });

    await db.device.update({
      where: { id: deviceId },
      data: {
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: 'Sensor data processed successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ message: 'Server error processing sensor data', error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = params.id;

    // Find the device by ID
    const device = await db.device.findUnique({
      where: { id: deviceId },
      include: {
        sensorReadings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!device) {
      return NextResponse.json(
        { message: 'Device not found', error: 'No device found with the given ID' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Device and sensor readings retrieved successfully',
        data: {
          device: {
            id: device.id,
            name: device.name,
            location: device.location,
            description: device.description,
            setTemperature: device.setTemperature,
            reverseRelay: device.reverseRelay,
            wifiName: device.wifiName,
            lastActivityAt: device.lastActivityAt,
          },
          sensorReadings: device.sensorReadings,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Unexpected error in GET handler:', error);
    return NextResponse.json({ message: 'Server error retrieving sensor data', error: error.message }, { status: 500 });
  }
}
