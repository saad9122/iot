// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Product, Prisma } from '@prisma/client';
import db from '@/db/db';
import { ApiResponse, generateErrorResponse, generateResponse } from '@/util/utilityFunctions';
import { IErrorResponse } from '@/app/_types/interfaces';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<Product | { message: string } | { message: string; error: string }>> {
  const { id } = params;
  try {
    const product = await db.product.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Product> | IErrorResponse>> {
  const { id } = params;
  try {
    const { name, retailPrice, salePrice, articleNumber, supplierArticleNumber, supplierName } = await request.json();
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        retailPrice: new Prisma.Decimal(retailPrice),
        salePrice: new Prisma.Decimal(salePrice),
        updatedAt: new Date(),
        articleNumber,
        supplierArticleNumber,
        supplierName,
      },
    });
    return NextResponse.json(generateResponse(true, 'Product updated', product), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}

export async function DELETE({
  params,
}: {
  params: { id: string };
}): Promise<NextResponse<ApiResponse<{}> | IErrorResponse>> {
  const { id } = params;
  try {
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json(generateResponse(true, 'product deleted', {}), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}
