import db from '@/db/db';
import { deviceSchema } from '@/util/validationSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const devices = await db.device.findMany({
      include: {
        sensorReadings: {
          select: {
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(devices, { status: 200 });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      {
        message: 'Error fetching devices',
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse incoming JSON data
    const body = await request.json();

    // Validate the data using Yup
    const validatedData = await deviceSchema.validate(body, { abortEarly: false });

    console.log(validatedData, 'validated Data');

    // Check if the MAC address already exists
    const existingDevice = await db.device.findUnique({
      where: { id: validatedData.macAddress },
    });

    if (existingDevice) {
      return NextResponse.json(
        { message: 'Device with this MAC address already exists.' },
        { status: 409 }, // Conflict
      );
    }

    // Create a new device in the database
    const newDevice = await db.device.create({
      data: {
        name: validatedData.name,
        id: validatedData.macAddress,
        location: validatedData.location,
        description: validatedData.description,
        setTemperature: validatedData.setTemperature,
        reverseRelay: validatedData.reverseRelay,
      },
    });

    return NextResponse.json(
      {
        message: 'Device registered successfully.',
        device: newDevice,
      },
      { status: 201 }, // Created
    );
  } catch (error) {
    console.error('Error creating device:', error);

    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 }, // Internal Server Error
    );
  }
}
