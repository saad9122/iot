export async function fetchAllCustmersAction(): Promise<ApiResponse<Customer[]> | ApiResponse<[]>> {
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
    return generateResponse(true, 'All customers', customers);
  } catch (error: any) {
    return generateResponse(false, (error as Error).message, []);
  }
}
