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

    test('Expect empty object when querying numerical, non-existent article_id with status 404', () => {
        return request(app)
            .get("/api/articles/1337")
            .expect(404)
            .then((response) => {
                expect(response.body).toStrictEqual({});
            }
            )
    })
});

describe("GET /api/users", () => {
    test('Every element in the returned array is an object, containing username, name and avatar_url as properties', () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                expect(response.body.users.length === 4);
                for (let eachObject of response.body.users) {
                    expect(eachObject)
                        .toEqual(expect.objectContaining({ 
                            username: expect.any(String), 
                            name: expect.any(String),
                            avatar_url: expect.any(String) }));
                }
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test('Returned object contains keys: "article_id", "title", "topic", "author", "body", "created_at", "votes"', () => {
        return request(app)
            .patch("/api/articles/5")
            .send({"inc_votes": 20})
            .expect(200)
            .then((response) => {
                expect(response.body.article).toEqual(expect.objectContaining(
                    {
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        title: expect.any(String),
                        topic: expect.any(String),
                        votes: expect.any(Number)
                    }));
            });
    });

    test('Returns user-friendly error if the request body key is not of the desired format."', () => {
        return request(app)
            .patch("/api/articles/5")
            .send({"ic_votes": 20})
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual("Bad request. Is the request body of the form {inc_votes: *Number*}?");
            });
    });

    test('Returns user-friendly error if the request body value is not of the desired format."', () => {
        return request(app)
            .patch("/api/articles/5")
            .send({"inc_votes": "20"})
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual("Bad request. Is the request body of the form {inc_votes: *Number*}?");
            });
    });

    test('Expect empty object when querying numerical, non-existent article_id with status 404', () => {
        return request(app)
            .patch("/api/articles/1337")
            .send({"inc_votes": 20})
            .expect(404)
            .then((response) => {
                expect(response.body).toStrictEqual({});
            }
            )
    })
});