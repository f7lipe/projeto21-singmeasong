import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js"
import { jest } from "@jest/globals";
import { cleanDatabase } from "../helper/databaseCleaner.js";
import * as recommendationFactory from "../factories/recommendationFactory.js";

beforeEach(async () => {
	await cleanDatabase();
	jest.resetAllMocks();
});

describe("Unit tests", ()=>{
    describe("Create", ()=>{
        it("should create recommendation with valid info", async ()=>{
        const recommendation = recommendationFactory.createRecommendationData();
        const spy = jest
                    .spyOn(recommendationRepository, "create")
                    .mockImplementationOnce(():any => {})
                    jest.spyOn(recommendationRepository,"findByName").mockImplementationOnce((): any => {});
                    await recommendationService.insert(recommendation);
                    expect(spy).toBeCalledWith(recommendation)
        })
        it("should call findByName", async ()=>{
            const recommendation = recommendationFactory.createRecommendationData();
            const spy = jest
                        .spyOn(recommendationRepository, 'findByName')
                        .mockResolvedValue(undefined);
            jest.spyOn(recommendationRepository,'create')
                        .mockImplementationOnce((): any => {});
            await recommendationService.insert(recommendation);
            expect(spy).toBeCalledWith(recommendation.name);
        })

        it("should throw error if name is already taken", async ()=>{
            const recommendation = await recommendationFactory.createRecomendation();
            jest.spyOn(recommendationRepository, 'findByName')
                        .mockResolvedValueOnce(recommendation);
            jest.spyOn(recommendationRepository,'create')
                        .mockImplementationOnce((): any => {});
           const insertion = await recommendationService.insert(recommendation)
           expect(insertion).rejects.toEqual({
            type: "conflict",
            message: "Recommendations names must be unique"
           })

        })
    })

    describe("Upvote", ()=>{
        it("should upvote recommendation", async ()=>{
            const recommendation = await recommendationFactory.createRecomendation();
            const spy = jest
                        .spyOn(recommendationRepository, 'find')
                        .mockImplementationOnce((): any => recommendation);
            jest.spyOn(recommendationRepository,'updateScore')
                        .mockImplementationOnce((): any => {});
            await recommendationService.upvote(recommendation.id);
            expect(spy).toBeCalledWith(recommendation.id);
        })

        it("should throw error if recommendation does not exist", async ()=>{
            jest.spyOn(recommendationRepository, 'find')
                        .mockImplementationOnce((): any => {});
            jest.spyOn(recommendationRepository,'updateScore')
                        .mockImplementationOnce((): any => {});
            const fakeId = faker.datatype.number({max: 0});
            const upvote = await recommendationService.upvote(fakeId);
            expect(upvote).rejects.toEqual({ type: 'not_found', message: '' });
        })
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