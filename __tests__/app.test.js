const request = require("supertest");
const app = require(`../app.js`);
const testData = require("../db/data/test-data/index.js")
//const pool = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")

beforeEach(() => {return seed(testData)})

//afterAll(() => {return pool.end()})

describe("GET /api/topics", () => 
{
    test('Every element in the returned array is an object, containing slug and description as properties', () => 
    {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => 
        {
            expect(response.body.topics.length === 3);
            for(let eachObject of response.body.topics)
            {
                expect.objectContaining({slug:expect.any(String), description:expect.any(String)});
            }
        });
    });
});