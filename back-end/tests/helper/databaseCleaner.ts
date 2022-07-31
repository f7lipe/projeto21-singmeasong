import { prisma } from "../../src/database.js"

export async function cleanDatabase(){
	await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
};

