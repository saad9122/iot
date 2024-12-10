// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Customer, Prisma } from '@prisma/client';
import db from '@/db/db';
import { ApiResponse, generateErrorResponse, generateResponse } from '@/util/utilityFunctions';
import { IErrorResponse } from '@/app/_types/interfaces';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ): Promise<NextResponse<Product | { message: string } | { message: string; error: string }>> {
//   const { id } = params;
//   try {
//     const product = await db.product.findUnique({
//       where: { id: Number(id) },
//     });
//     if (product) {
//       return NextResponse.json(product);
//     } else {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching product', error: (error as Error).message }, { status: 500 });
//   }
// }

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Customer> | IErrorResponse>> {
  const { id } = params;
  try {
    const { name, address, city, street, phoneNumber, landlineNumber, createdBy, regionType } = await request.json();
    const customer = await db.customer.update({
      where: { id: Number(id) },
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

    return NextResponse.json(generateResponse(true, 'Customer updated', customer), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string | number } },
): Promise<NextResponse<ApiResponse<{}> | IErrorResponse>> {
  const { id } = params;
  try {
    await db.customer.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(generateResponse(true, 'Customer deleted', {}), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}
