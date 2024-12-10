// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@prisma/client';

import db from '@/db/db';
import { ApiResponse, generateErrorResponse, generateResponse, generateShortUUID } from '@/util/utilityFunctions.ts';
import { IErrorResponse } from '@/app/_types/interfaces';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(): Promise<NextResponse<ApiResponse<Product[]> | IErrorResponse>> {
  try {
    const products: Product[] = await db.product.findMany({
      where: { isDeleted: false },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(generateResponse(true, 'Product created', products), { status: 200 });
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product> | IErrorResponse>> {
  try {
    const data = await request.json();
    const { name, retailPrice, salePrice, createdBy, articleNumber, supplierName, supplierArticleNumber } = data;

    const alreadyExist = await db.product.findFirst({
      where: { name: name },
    });

    if (alreadyExist) {
      return NextResponse.json(generateErrorResponse('Product already Exist'), { status: 500 });
    }
    const product = await db.product.create({
      data: {
        id: generateShortUUID(),
        name,
        retailPrice,
        salePrice,
        createdBy,
        articleNumber,
        supplierName,
        supplierArticleNumber,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: 'product Created',
        data: product,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(generateErrorResponse((error as Error).message), { status: 500 });
  }
}
