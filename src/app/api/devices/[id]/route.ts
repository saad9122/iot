// app/api/devices/route.ts
import db from '@/db/db';
import { generateResponse } from '@/util/utilityFunctions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = params.id;

    console.log(deviceId, 'device id');

    // Find the device by ID
    const device = await db.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { message: 'Device not found', error: 'No device found with the given ID' },
        { status: 404 },
      );
    }

    return NextResponse.json(generateResponse(true, 'All Region Types', device), { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET handler:', error);
    return NextResponse.json(generateResponse(false, (error as Error).message, []), { status: 500 });
  }
}
