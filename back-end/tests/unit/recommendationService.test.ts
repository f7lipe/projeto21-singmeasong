import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js"
import { jest } from "@jest/globals";
import { cleanDatabase } from "../helper/databaseCleaner.js";

beforeEach(async () => {
	await cleanDatabase();
	jest.resetAllMocks();
});

describe("Unit tests", ()=>{
    describe("Create", ()=>{
        it("should create recommendation with valid info",  ()=>{
        
        })
    })

    describe("Upvote", ()=>{

    })

    describe("Downvote", ()=>{
    })

    describe("Get", ()=>{
    })

    describe("Get top 10", ()=>{
    
    })

    describe("Get by id", ()=>{
    })

    describe("Get randomic", ()=>{
    })

})

afterAll(async () => {
	await cleanDatabase();
});