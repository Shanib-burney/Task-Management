import { prisma } from '../../src/db/prisma-client';

// Ensure database connection for E2E tests
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Clean database before each test
beforeEach(async () => {
  // Clean all tables in correct order (respecting foreign keys)
  await prisma.userTeam.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userTeam.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
});