import { faker } from "@faker-js/faker";

import { prisma } from "./../../src/database.js";
import { Recommendation } from "@prisma/client";
type recommendation = Omit<Recommendation, "id" | "score">;

export default function createRecoomendation(youtubeLink: string = null){
    const recommendation: recommendation = {
        name: faker.music.songName(),
        youtubeLink: youtubeLink || "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    };
    return recommendation;
}