import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../src/app.js";

import createRecoomendation from "./factories/recommendationFactory.js";

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

})