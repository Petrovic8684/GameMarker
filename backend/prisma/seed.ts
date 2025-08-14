import { PrismaClient } from '@prisma/client';
import { Role } from '../src/common/enums/role.enum';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: 1,
      email: 'jovan8684@gmail.com',
      username: 'Grgantis',
      password: '$2a$12$r6ubQd24tcf1Xg951LW5HexzplrMkTv5/BvjcncstTYsPQOd0s00C',
      role: Role.admin,
      image: 'https://www.w3schools.com/w3images/avatar3.png',
      gender: 'male',
      bio: 'Exploring worlds, mastering games, and sharing the journey. 🎮',
    },
  });

  console.log('Seed data inserted.');
}

main()
  .catch((error) => {
    console.log(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
