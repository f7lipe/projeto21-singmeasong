import { prisma } from "./../../src/database.js";
import createRecoomendation from "./recommendationFactory.js";

export async function createRecommendationWithSucess(){
    const recommendation = createRecoomendation();
    const response = await prisma.recommendation.create({
        data: recommendation
    });
    return response;
}