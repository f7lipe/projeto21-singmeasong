import { faker } from "@faker-js/faker";
import _ from 'lodash';
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

		it('should throw error when name already exists', async () => {
			const recommendation = await recommendationFactory.createRecomendation();
			jest.spyOn(recommendationRepository,'findByName').mockResolvedValueOnce(recommendation);
			jest.spyOn(recommendationRepository,'create').mockImplementationOnce((): any => {});
			const result = recommendationService.insert(recommendation);
			expect(result).rejects.toEqual({
				type: 'conflict',
				message: 'Recommendations names must be unique',
			});
		});
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
            const id = faker.datatype.number({ max: 0 });
			jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
				(): any => {}
			);
			jest.spyOn(recommendationRepository,'updateScore').mockImplementationOnce((): any => {});
			const result = recommendationService.upvote(id);
			expect(result).rejects.toEqual({ type: 'not_found', message: '' });
        })
    })

    describe("Downvote", ()=>{
        it("should downvote recommendation", async ()=>{
            const recommendation = await recommendationFactory.createRecomendation();
            const spy = jest
                        .spyOn(recommendationRepository, 'find')
                        .mockImplementationOnce((): any => recommendation);
            jest.spyOn(recommendationRepository,'updateScore')
                        .mockImplementationOnce((): any => {
                            return {
                                ...recommendation,
                                score: recommendation.score - 1
                            }
                        });
            await recommendationService.downvote(recommendation.id);
            expect(spy).toBeCalledWith(recommendation.id);
        })

        it("should call function update score with decrement params in repository", async ()=>{
            const recommendation = await recommendationFactory.createRecomendation();
            jest.spyOn(recommendationRepository, 'find')
                        .mockImplementationOnce((): any => recommendation);
            const spy = jest.spyOn(recommendationRepository,'updateScore')
                        .mockImplementationOnce((): any => {
                            return {
                                ...recommendation,
                                score: recommendation.score - 1
                            }
                        });
            await recommendationService.downvote(recommendation.id);
            expect(spy).toBeCalledWith(recommendation.id, 'decrement');
        })

        it('should call function delete recommendation when update recommendation with score to set lowest than -5', async () => {
			const recommendation = await recommendationFactory.createRecomendation({score: -6});
			jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
				(): any => recommendation
			);
			jest.spyOn(
				recommendationRepository,
				'updateScore'
			).mockImplementationOnce((): any => {
				return { ...recommendation, score: recommendation.score - 1 };
			});
			const spy = jest
				.spyOn(recommendationRepository, 'remove')
				.mockImplementationOnce((): any => {});

			await recommendationService.downvote(recommendation.id);
			expect(spy).toBeCalledWith(recommendation.id);
		});

    })

    describe("Get all", ()=>{
		it('should call function findAll', async () => {
			const recommendations = await Promise.all(
				_.times(5, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockImplementationOnce((): any => recommendations);

			const result = await recommendationService.get();
			expect(spy).toHaveBeenCalled();
			expect(result).toEqual(recommendations);
		});
    })

    describe("Get top 10", ()=>{
        it('should call function getAmountByScore', async () => {
			const amount = faker.datatype.number({ min: 1 });
			const recommendations = await Promise.all(
				_.times(10, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'getAmountByScore')
				.mockImplementationOnce((): any => recommendations);

			const result = await recommendationService.getTop(amount);
			expect(spy).toHaveBeenCalledWith(amount);
			expect(result).not.toBeNull();
		});
    })

    describe("Get by id", ()=>{
        it('should call function find in recommendations repository', async () => {
			const recommendation = await recommendationFactory.createRecomendation();
			const spy = jest
				.spyOn(recommendationRepository, 'find')
				.mockImplementationOnce((): any => recommendation);

			const result = await recommendationService.getById(
				recommendation.id
			);
			expect(spy).toHaveBeenCalledWith(recommendation.id);
			expect(result).not.toBeNull();

         })

         it('should throw error for a not found id', async () => {
			
			jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
				(): any => {}
			);
            const fakeID = faker.datatype.number({ max: 0 });
			const result = recommendationService.getById(fakeID);
			expect(result).rejects.toEqual({
				type: 'not_found',
				message: '',
			});
		});
    })

    describe("Get randomic", ()=>{

        it('should call findAll with gt into score filter when a randomic number is less than 0.7', async () => {
			const recommendations = await Promise.all(
				_.times(5, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockImplementationOnce((): any => recommendations);

			jest.spyOn(Math, 'random').mockReturnValue(0.6);

			await recommendationService.getRandom();
			expect(spy).toHaveBeenCalledWith({ score: 10, scoreFilter: 'gt' });
		});

        it('should call findAll with gt into score filter when a randomic number is grater than 0.7', async () => {
			const recommendations = await Promise.all(
				_.times(5, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockImplementationOnce((): any => recommendations);

			jest.spyOn(Math, 'random').mockReturnValue(0.8);

			await recommendationService.getRandom();
			expect(spy).toHaveBeenCalledWith({ score: 10, scoreFilter: 'lte' });
		});

        it('should call findAll with random value for Math.random', async () => {
			const recommendations = await Promise.all(
				_.times(5, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockImplementationOnce((): any => recommendations);

			jest.spyOn(Math, 'random').mockReturnValue(
				faker.datatype.float({ min: 0, max: 1 })
			);

			await recommendationService.getRandom();
			expect(spy).toHaveBeenCalledWith({
				score: 10,
				scoreFilter: expect.stringMatching(/^(gt|lte)$/),
			});
		});

        it('should call findAll twice when does not exist recommendations scoring bigger 10', async () => {
			const recommendations = await Promise.all(
				_.times(5, async () => {
					return await recommendationFactory.createRecomendation({
						score: faker.datatype.number({ min: 0, max: 9 }),
					});
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockImplementationOnce((): any => [])
				.mockImplementationOnce((): any => recommendations);

			jest.spyOn(Math, 'random').mockReturnValue(
				faker.datatype.float({ min: 0, max: 1 })
			);

			await recommendationService.getRandom();
			expect(spy).toHaveBeenCalledTimes(2);
		});

        it('should throw notFoundError when does not exists recommendations', async () => {
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockResolvedValue([]);

			jest.spyOn(Math, 'random').mockReturnValue(
				faker.datatype.float({ min: 0, max: 1 })
			);

			const result = recommendationService.getRandom();
			expect(result).rejects.toEqual({ type: 'not_found', message: '' });
		});

        it('should get a random recommendation', async () => {
			const recommendations = await Promise.all(
				_.times(10, async () => {
					return await recommendationFactory.createRecomendation();
				})
			);
			const spy = jest
				.spyOn(recommendationRepository, 'findAll')
				.mockResolvedValue(recommendations);

			jest.spyOn(Math, 'random').mockReturnValue(
				faker.datatype.float({ min: 0, max: 1 })
			);
			const floor = faker.datatype.number({ min: 0, max: 10 });
			jest.spyOn(Math, 'floor').mockReturnValue(floor);

			const result = await recommendationService.getRandom();
			expect(result).toEqual(recommendations[floor]);
		});
    })
    

})

afterAll(async () => {
	await cleanDatabase();
});