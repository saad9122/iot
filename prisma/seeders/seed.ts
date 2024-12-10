import { getHashedPassword } from '../../src/app/_actions/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'admin',
    },
  });
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userName: 'test2',
      password: await getHashedPassword('test123'),
      roleId: 1,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
