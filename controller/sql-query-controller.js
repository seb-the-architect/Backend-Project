const model = require("../model/sql-query-model.js");

exports.getAllTopics = async function(req, res, next)
{
    const allTopics = await model.queryAllTopics();
    
    try { res.status(200).send({"topics": allTopics}) } 
    catch (err) { next(err) }
}

exports.getArticle = async function(req, res, next)
{
    //If the id consists only of numbers (input validation / injection prevention)
    if(/^[0-9]+$/.test(req.params.article_id)) 
    { 
        const article = await model.queryArticle(req.params.article_id)
        try { res.status(200).send({"article": article}) } 
        catch (err) { next(err) } 
    }
    else {
        try { res.status(400).send({"error": "Bad request. Is the ID supplied correct?"}) } 
        catch (err) { next(err) }
    }
}