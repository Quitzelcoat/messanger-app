import prisma from './prismaClient.js'; // your existing Prisma client

async function main() {
  try {
    // Check if a table exists by trying to query it
    await prisma.user.findFirst();
    console.log('Tables already exist.');
  } catch (err) {
    console.log('Tables not found. Creating tables...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "User" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT UNIQUE NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "profilePic" TEXT
      );

      CREATE TABLE "Message" (
        "id" SERIAL PRIMARY KEY,
        "senderId" INT NOT NULL REFERENCES "User"(id),
        "receiverId" INT NOT NULL REFERENCES "User"(id),
        "content" TEXT NOT NULL,
        "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

main();
