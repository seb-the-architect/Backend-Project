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
    test('Returned value is an object with keys: article_id, title, topic, author, created_at, votes, body', () => {
        return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then((response) => {
                expect(response.body.article).toEqual(expect.objectContaining(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        body: expect.any(String)
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
                            avatar_url: expect.any(String)
                        }));
                }
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test('Returned object contains keys: "article_id", "title", "topic", "author", "body", "created_at", "votes"', () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ "inc_votes": 20 })
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
            .send({ "ic_votes": 20 })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual("Bad request. Is the request body of the form {inc_votes: *Number*}?");
            });
    });

    test('Returns user-friendly error if the request body value is not of the desired format."', () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ "inc_votes": "20" })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual("Bad request. Is the request body of the form {inc_votes: *Number*}?");
            });
    });

    test('Expect empty object when querying numerical, non-existent article_id with status 404', () => {
        return request(app)
            .patch("/api/articles/1337")
            .send({ "inc_votes": 20 })
            .expect(404)
            .then((response) => {
                expect(response.body).toStrictEqual({});
            }
            )
    })
});

describe("Articles are returned with new 'comment_count' property.", () => {
    test('Returned object has key:"comment_count" when GETting" ', () => {
        return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then((response) => {
                expect(response.body.article.comment_count === undefined).toEqual(false);
            }
            )
    })

    test('Returned object has key:"comment_count" when PATCHing', () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ "inc_votes": 20 })
            .expect(200)
            .then((response) => {
                expect(response.body.article.comment_count === undefined).toEqual(false);
            }
            )
    })
});

describe("GET /api/articles", () => {
    test(`Every element in the returned array is an object, with keys: comment_count, article_id, title, topic, author, created_at, votes, body`, () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toEqual(12);
                for (let eachObject of response.body.articles) {
                    expect(eachObject).toEqual(expect.objectContaining(
                        {
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            body: expect.any(String)
                        }));
                }
            });
    });

    test(`If a topic query is specified, all articles are filtered by it.`, () => {
        return request(app)
            .get("/api/articles")
            .query({ topic: 'cats' })
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toEqual(1);
                for (let eachObject of response.body.articles) {
                    expect(eachObject.topic).toEqual("cats");
                }
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test(`Every element in the returned array is an object, with keys: comment_id, votes, created_at, author, body`, () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toEqual(11);
                for (let eachObject of response.body.comments) {
                    expect(eachObject).toEqual(expect.objectContaining(
                        {
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                        }));
                }
            });
    });

    test(`Returned array is empty when there are no comments for an article_id.`, () => {
        return request(app)
            .get("/api/articles/1337/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toEqual(0);
            });
    });
});

describe("POST /api/articles/:article_id/comments", () => {
    test(`Return is an object, with keys: comment_id, votes, created_at, author, body`, () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({ "username": "lurker", "body": "new sauce" })
            .expect(201)
            .then((response) => {
                expect(response.body.comment).toEqual(expect.objectContaining(
                    {
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    }));
            });
    });

    test(`Bad request message sent when body property doesnt exist in request body.`, () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({ "username": "lurker", "bodyyy": "new sauce" })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe("Bad request. Make sure: The request body has properties username and body AND the article_id and username exist in articles and users respectively.");
            });
    });

    test(`Bad request message sent when username property doesnt exist in request body.`, () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({ "usernameee": "lurker", "body": "new sauce" })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe("Bad request. Make sure: The request body has properties username and body AND the article_id and username exist in articles and users respectively.");
            });
    });

    test(`Bad request message sent when article number doesnt exist in articles.`, () => {
        return request(app)
            .post("/api/articles/1337/comments")
            .send({ "username": "lurker", "body": "new sauce" })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe("Bad request. Make sure: The request body has properties username and body AND the article_id and username exist in articles and users respectively.");
            });
    });

    test(`Bad request message sent when username doesnt exist users.`, () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({ "username": "alwaysalurker", "body": "new sauce" })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe("Bad request. Make sure: The request body has properties username and body AND the article_id and username exist in articles and users respectively.");
            });
    });
});

//But with sort_by and order and topic
describe("GET /api/articles", () => {
    test(`Successfull with no query parameters`, () => {
        return request(app).get("/api/articles").expect(200)
    });

    test(`Successfull with sort_by parameter`, () => {
        return request(app).get("/api/articles").query({ sort_by: 'author' }).expect(200);
    });

    test(`Successfull with order parameter`, () => {
        return request(app).get("/api/articles").query({ order: 'DESC' }).expect(200);
    });

    test(`Successfull with topic parameter`, () => {
        return request(app).get("/api/articles").query({ topic: 'cats' }).expect(200);
    });

    test(`Unsuccessfull with bad topic parameter`, () => {
        return request(app).get("/api/articles").query({ topic: 'bananas' }).expect(404).then((response) => {
            expect(response.body.error).toBe("Ensure that the topic exists.");
        });;
    });

    test(`Unsuccessfull with bad sort_by parameter`, () => {
        return request(app).get("/api/articles").query({ sort_by: 'bananas' }).expect(400).then((response) => {
            expect(response.body.error).toBe("Ensure that the property you are trying to sort_by exists.");
        });;
    });

    test(`Unsuccessfull with bad order parameter`, () => {
        return request(app).get("/api/articles").query({ order: 'bananas' }).expect(400).then((response) => {
            expect(response.body.error).toBe("The order can only be ASC or DESC");
        });;
    });

    test(`Successfull where topic does not exist in articles.`, () => {
        return request(app).get("/api/articles").query({ topic: 'paper' }).expect(200).then((response) => {
            expect(response.body.articles).toStrictEqual([]);
        });;
    });
});