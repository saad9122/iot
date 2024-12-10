import db from '@/db/db';
import { ApiResponse, generateResponse } from '@/util/utilityFunctions';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<Role[]> | ApiResponse<[]>>> {
  try {
    const roles: Role[] = await db.role.findMany({
      where: { isDeleted: false },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(generateResponse(true, 'All Roles', roles), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateResponse(false, (error as Error).message, []), { status: 500 });
  }
}
