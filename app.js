const controller = require("./controller/sql-query-controller.js")
const express = require("express");

const app = express();

app.get("/api/topics", controller.getAllTopics)

app.listen(5000, ()=>
{
    console.log("Listening on port 5000");
})

module.exports = app;