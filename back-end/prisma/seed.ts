import { prisma } from "../src/database.js";

async function main(){
    await prisma.recommendation.create({
        data: {
            name: "Recommendation 1",
            youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
})
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
