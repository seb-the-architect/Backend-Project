const request = require("supertest");
const app = require(`../controller/app.js`);

/*
GET /api/topics
-------------------
Responds with: an array of topic objects, each of which should have the following properties:
slug
description
-------------------
*/

describe("GET /api/topics", () => 
{
    test('Responds with an array.', () => 
    {
        return request(app)
        .get("/api/topics")
        .expect(200)
        //array = response data
        .then((array) => 
        {
            expect(Array.isArray(array.body)).toEqual(false);
        });
    });

    test('Every element in the returned array is an object', () => 
    {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((array) => 
        {
            console.log(array);
            for(let eachObject of array)
            {
                expect(Object.prototype.toString.call(eachObject)).toEqual("[object Object]");
            }
        });
    });

    test('Every object contains in the returned array has "slug" and "description" as properties.', () => 
    {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => 
        {
            expect(response.body).toEqual({ message: "all ok" });
        });
    });
});