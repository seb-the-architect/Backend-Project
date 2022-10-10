const pool = require("../db/connection.js")

//Database: nc-news
//Table: topics

//Returns all topics as a list of objects
exports.getAllTopics = async function()
{
    const allTopics = await pool.query("SELECT * FROM topics");
    return allTopics.rows;
}