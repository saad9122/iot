import { NextResponse } from 'next/server';
import { ApiResponse, generateResponse } from '@/util/utilityFunctions';
import { RegionType } from '@prisma/client';
import db from '@/db/db';

export async function GET(): Promise<NextResponse<ApiResponse<RegionType[]> | ApiResponse<[]>>> {
  try {
    const regionTypes: RegionType[] = await db.regionType.findMany({
      where: { isDeleted: false },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(generateResponse(true, 'All Region Types', regionTypes), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateResponse(false, (error as Error).message, []), { status: 500 });
  }
}
