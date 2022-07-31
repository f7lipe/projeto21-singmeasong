import { faker } from "@faker-js/faker";
import { prisma } from "../src/database.js";
import supertest from "supertest";
import app from "../src/app.js";

import createRecoomendation from "./factories/recommendationFactory.js";
afterAll(async () => {
   await prisma.recommendation.deleteMany();
   await prisma.$disconnect();
})

describe("App tests", () => {
const agent = supertest(app)
    it("Should create a recommendation with valid credential", async() => {
        const response = await agent
                               .post("/recommendations")
                               .send(createRecoomendation());
        expect(response.status).toBe(201);
    })

    it("Should not create a recommendation with invalid credential", async() => {
        const response = await agent
                               .post("/recommendations")
                               .send(createRecoomendation(faker.internet.url()));
        expect(response.status).toBe(422);
     })

     it("Should upvote a recommendation", async() => {
        const response = await agent
                               .post("/recommendations/1/upvote")
                               .send();
        expect(response.status).toBe(200);
     })

     it("Should downvote a recommendation", async() => {
        const response = await agent
                               .post("/recommendations/1/downvote")
                               .send();
        expect(response.status).toBe(200);
     })

     it("Should not upvote or downvote a recommendation with invalid id", async() => {
        const upvoteResponse = await agent
                               .post("/recommendations/-1/upvote")
                               .send();
        expect(upvoteResponse.status).toBe(404);

        const downvoteResponse = await agent
                        .post("/recommendations/-1/upvote")
                        .send();
                         expect(downvoteResponse.status).toBe(404);
     })

     it("Should get 10 recommendations", async() => {
        const response = await agent
                               .get("/recommendations");
        expect(response.status).toBe(200);
        //expect(response.body.array).toBeLessThanOrEqual(10);
     })

     it("Should get a recommendation by id", async() => {
         const response = await agent
                                  .get("/recommendations/1");
         expect(response.status).toBe(200);
       })


     it("Should not get a recommendation with an ivalid id", async() => {
      const response = await agent
                               .get("/recommendations/-1");
      expect(response.status).toBe(404);
    })
})