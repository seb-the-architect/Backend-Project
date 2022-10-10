const model = require("../model/sql-query-model.js");

exports.getAllTopics = async function(req, res)
{
    const allTopics = await model.queryAllTopics();
    
    try { res.status(200).send({"topics": allTopics}) } 
    catch (error) { console.error(error); }
}