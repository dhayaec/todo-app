import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.createMany({
    data: [
      { title: 'Learn Next.js', completed: false },
      { title: 'Set up Prisma', completed: true },
      { title: 'Build a Todo App', completed: false },
      { title: 'Test Jest Integration', completed: true },
    ],
  });
}

main()
  .then(() => {
    console.log('Database seeded!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
