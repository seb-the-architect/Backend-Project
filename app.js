const controller = require("./controller/sql-query-controller.js")
const express = require("express");

const app = express();

app.get("/api/topics", controller.getAllTopics);
app.get("/api/articles/:article_id", controller.getArticle);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error!');
});

app.listen(5000, ()=>
{
    console.log("Listening on port 5000");
});

module.exports = app;