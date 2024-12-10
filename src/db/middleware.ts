import { Prisma } from '@prisma/client';

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.model && params.action === 'findMany') {
    // Modify query to filter out deleted records
    if (!params.args) {
      params.args = {};
    }
    if (!params.args.where) {
      params.args.where = {};
    }
    params.args.where.deletedAt = null;
  }

  if (params.action === 'delete') {
    // Change to update
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }

  if (params.action === 'deleteMany') {
    // Change to updateMany
    params.action = 'updateMany';
    if (params.args.data) {
      params.args.data['deletedAt'] = new Date();
    } else {
      params.args['data'] = { deletedAt: new Date() };
    }
  }

  return next(params);
};
