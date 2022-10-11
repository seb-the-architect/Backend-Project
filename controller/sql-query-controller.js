const model = require("../model/sql-query-model.js");

exports.getAllTopics = async function(req, res)
{
    const allTopics = await model.queryAllTopics();
    
    try { res.status(200).send({"topics": allTopics}) } 
    catch (error) { console.error(error); }
}

exports.getArticle = async function(req, res)
{
    //If the id consists only of numbers (input validation / injection prevention)
    if(/^[0-9]+$/.test(req.params.article_id)) 
    { 
        const article = await model.queryArticle(req.params.article_id)
        try { res.status(200).send({"article": article}) } 
        catch (error) { console.error(error); } 
    }
    else {
        try { res.status(400).send({"error": "Bad request. Is the ID supplied correct?"}) } 
        catch (error) { console.error(error); }
    }
}