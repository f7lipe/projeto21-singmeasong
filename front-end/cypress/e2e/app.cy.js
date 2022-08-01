/// <reference types="cypress" />

import { faker } from "@faker-js/faker";
import _ from "lodash";

const appUrl = "localhost:3000";
const api = "localhost:5000"

describe("Home suit", ()=>{
    const recommendation = {
        name: faker.music.songName(),
        youtubeLink:  `https://www.youtube.com/${faker.datatype.uuid()}`
    }

	it('should add a new recommendation', () => {
		cy.visit('http://localhost:3000');
		cy.request('POST', 'http://localhost:5000/recommendations', {
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
		}).as('postRecommendation');

		cy.get("input[type='text']").type(recommendation.name);
		cy.get("input[type='link']").type(recommendation.youtubeLink);
		cy.get('.create-new-recommendation-button').click();
	});

    it('should increase score by 1 when click on upvote icon', () => {
		cy.get('.go-arrow-up-icon').click({ multiple: true });
	});

    it('should descrease score by 1 when click on downvote icon', () => {
		cy.get('.go-arrow-down-icon').click({ multiple: true });
	});

})

describe('Random recommendation suit', () => {
	it('should show only one random recommendation', () => {
		cy.visit('http://localhost:3000/random');
		cy.intercept('GET', '/recommendations/random').as('getRecommendations');
		cy.wait('@getRecommendations');
		cy.get('article').should('have.length', 1);
		console.log('article', cy.get('article'));
	});
});

describe('Top 10 suite', () => {
	it('should shows the top 10 recommended', () => {
		cy.visit('http://localhost:3000/top');
		cy.intercept('GET', '/recommendations/top/10').as('getRecommendations');
		cy.wait('@getRecommendations');
		cy.get('article').should('be.length.lte', 10);
	});
});
