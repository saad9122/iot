// app/api/devices/route.ts
import db from '@/db/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all devices from the database
    const devices = await db.device.findMany({
      select: {
        id: true,
        macAddress: true,
        name: true,
        isActive: true,
        location: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the list of devices
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
