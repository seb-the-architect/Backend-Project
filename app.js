const controller = require("./controller/sql-query-controller.js")
const express = require("express");

const app = express();

/*
GET /api/topics
-------------------
Responds with: an array of topic objects, each of which should have the following properties:
slug
description
-------------------
*/

app.get("/api/topics", controller.getAllTopics)

app.listen(5000, ()=>
{
    console.log("Listening on port 5000");
})

module.exports = app;