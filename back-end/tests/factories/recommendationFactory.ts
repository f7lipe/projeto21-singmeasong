import { faker } from "@faker-js/faker";

import { prisma } from "./../../src/database.js";
import { Recommendation } from "@prisma/client";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export async function createRecomendation(recommendation: Partial<Recommendation> = {}): Promise<Recommendation>{
    return prisma.recommendation.create({
        data: {
            name: recommendation.name || faker.music.songName(),
            youtubeLink: recommendation.youtubeLink || `https://www.youtube.com/watch?v=${faker.datatype.uuid()}`,
            score: recommendation.score || undefined,
		},
	});
};


export function createRecommendationData():CreateRecommendationData{
    return {
        name: faker.music.songName(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.datatype.uuid()}`,
    };
}

export function loadRecommendation(id: number):Promise<Recommendation>{
	return prisma.recommendation.findFirst({
		where: {
			id,
		},
	});
};