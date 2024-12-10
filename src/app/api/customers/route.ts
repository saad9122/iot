// app/api/products/route.ts
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { Customer } from '@prisma/client';
import db from '@/db/db';
import { ApiResponse, generateErrorResponse, generateResponse } from '@/util/utilityFunctions.ts';
import { IErrorResponse } from '@/app/_types/interfaces';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(): Promise<NextResponse<ApiResponse<Customer[]> | IErrorResponse>> {
  try {
    const customers: Customer[] = await db.customer.findMany({
      where: { isDeleted: false },
      include: {
        regionType: {
          select: {
            name: true,
            tax: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const generatedResponse = generateResponse(true, 'customer created', customers);

    return NextResponse.json(generatedResponse, { status: 200 });
  } catch (error) {
    console.error((error as Error).message);
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Customer> | ApiResponse<{}>>> {
  try {
    const data = await request.json();
    const { name, address, city, street, phoneNumber, landlineNumber, createdBy, regionType } = data;

    const customer = await db.customer.create({
      data: {
        name,
        address,
        city,
        street,
        phoneNumber,
        landlineNumber: landlineNumber ?? null,
        regionType,
        createdBy,
      },
    });
    return NextResponse.json(generateResponse(true, 'Product created', customer), { status: 200 });
  } catch (error) {
    console.error((error as Error).message);
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}
