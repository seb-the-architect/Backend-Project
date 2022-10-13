const controller = require("./controller/sql-query-controller.js")
const express = require("express");

const app = express();

app.use(express.json())

app.get("/api/topics", controller.getAllTopics);
app.get("/api/articles/:article_id", controller.getArticle);
app.get("/api/users", controller.getAllUsers);
app.patch("/api/articles/:article_id", controller.patchArticle);
app.get("/api/articles", controller.getAllArticles);
app.get("/api/articles/:article_id/comments", controller.getAllComments);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error!');
});

// app.listen(5000, ()=>
// {
//     console.log("Listening on port 5000");
// });

module.exports = app;