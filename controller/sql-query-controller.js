const model = require("../model/sql-query-model.js");

exports.getAllTopics = async function (req, res, next) {
    const allTopics = await model.queryAllTopics();

    try { res.status(200).send({ "topics": allTopics }) }
    catch (err) { next(err) }
}

exports.getArticle = async function (req, res, next) {
    //If the id consists only of numbers (input validation / injection prevention)
    if (/^[0-9]+$/.test(req.params.article_id)) {
        const article = await model.queryArticle(req.params.article_id);
        const comment_count = (await model.queryAllComments(req.params.article_id)).length;
        if (article) { article["comment_count"] = comment_count; }
        try { res.status(article === undefined ? 404 : 200).send({ "article": article }) }
        catch (err) { next(err) }
    }
    else {
        try { res.status(400).send({ "error": "Bad request. Is the ID supplied correct?" }) }
        catch (err) { next(err) }
    }
}

exports.getAllUsers = async function (req, res, next) {
    const allUsers = await model.queryAllUsers();
    try { res.status(200).send({ "users": allUsers }) }
    catch (err) { next(err) }
}

exports.patchArticle = async function (req, res, next) {
    //Check that the request body has the desired format.
    if (req.body.inc_votes === undefined ? false : typeof (req.body.inc_votes) === "number") {
        const patchedArticle = await model.queryPatchArticle(req.params.article_id, req.body);
        const comment_count = (await model.queryAllComments(req.params.article_id)).length;
        if (patchedArticle) { patchedArticle["comment_count"] = comment_count; }
        try { res.status(patchedArticle === undefined ? 404 : 200).send({ "article": patchedArticle }) }
        catch (err) { next(err) }
    }
    else {
        try { res.status(400).send({ "error": "Bad request. Is the request body of the form {inc_votes: *Number*}?" }) }
        catch (err) { next(err) }
    }
}

exports.getAllArticles = async function (req, res, next) {
    const allTopics = await model.queryAllTopics();
    if(!(allTopics.map(eachTopic => eachTopic.slug)).includes(req.query.topic) && req.query.topic)
    {
        try { res.status(404).send({ "error": "Ensure that the topic exists." }) }
        catch (err) { next(err) }
        return;
    }
    else if(!Object.keys((await model.queryAllArticles())[0]).includes(req.query.sort_by) && req.query.sort_by)
    {
        try { res.status(400).send({ "error": "Ensure that the property you are trying to sort_by exists." }) }
        catch (err) { next(err) }
        return;
    }
    if(req.query.order)
    {
        console.log(req.query.order.toLowerCase());
        if(req.query.order.toLowerCase() !== "asc" && req.query.order.toLowerCase() !== "desc")
        {
            try { res.status(400).send({ "error": "The order can only be ASC or DESC" }) }
            catch (err) { next(err) }
            return;
        }
    }
    const allArticles = await model.queryAllArticles(req.query.topic, req.query.sort_by, req.query.order);
    try { res.status(200).send({ "articles": allArticles }) }
    catch (err) { next(err) }
    return;
}

exports.getAllComments = async function (req, res, next) {
    const allComments = await model.queryAllComments(req.params.article_id);
    try { res.status(200).send({ "comments": allComments }) }
    catch (err) { next(err) }
}

exports.postNewComment = async function (req, res, next) {
    const article = await model.queryArticle(req.params.article_id);
    const allUsers = await model.queryAllUsers();
    //If the article_id is present in the articles table and the username is present in users table
    // AND if properties username and body exist in the request body
    if (article !== undefined
        &&
        ((allUsers.filter(eachUser => eachUser.username === req.body.username)).length !== 0)
        &&
        req.body.body) {
        const newComment = await model.queryPostNewComment(req.params.article_id, req.body)
        try { res.status(201).send({ "comment": newComment }) }
        catch (err) { next(err) }
    }
    else {
        try {
            res.status(400).send({
                "error":
                    "Bad request. Make sure: The request body has properties username and body AND the article_id and username exist in articles and users respectively."
            })
        }
        catch (err) { next(err) }
    }
}