const pool = require("../db/connection.js")

//Database: nc-news
//Table: topics

//Returns all topics as a list of objects
exports.queryAllTopics = async function()
{
    const allTopics = await pool.query("SELECT * FROM topics");
    console.log(allTopics.rows);
    return allTopics.rows;
}