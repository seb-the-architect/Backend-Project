const request = require("supertest");
const app = require(`../app.js`);
const testData = require("../db/data/test-data/index.js")
const pool = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")

beforeEach(() => { return seed(testData) })

afterAll(() => { return pool.end() })

describe("GET /api/topics", () => {
    test('Every element in the returned array is an object, containing slug and description as properties', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                expect(response.body.topics.length === 3);
                for (let eachObject of response.body.topics) {
                    expect(eachObject)
                        .toEqual(expect.objectContaining({ slug: expect.any(String), description: expect.any(String) }));
                }
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    test('Returned value is an object with keys: article_id, title, topic, name, created_at, votes', () => {
        return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then((response) => {
                expect(response.body.article).toEqual(expect.objectContaining(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        name: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    }));
            }
            )
    })

    test('Incorrect user input is rejected with status 400.', () => {
        return request(app)
            .get("/api/articles/spaghettios")
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual("Bad request. Is the ID supplied correct?")
            }
            )
    })
});