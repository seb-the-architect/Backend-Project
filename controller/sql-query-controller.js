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
        if(article) { article["comment_count"] = comment_count; }
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
        if(patchedArticle) { patchedArticle["comment_count"] = comment_count; }
        try { res.status(patchedArticle === undefined ? 404 : 200).send({ "article": patchedArticle }) }
        catch (err) { next(err) }
    }
    else {
        try { res.status(400).send({ "error": "Bad request. Is the request body of the form {inc_votes: *Number*}?" }) }
        catch (err) { next(err) }
    }
}