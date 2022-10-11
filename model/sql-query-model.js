const pool = require("../db/connection.js")

exports.queryAllTopics = async function()
{
    const allTopics = await pool.query("SELECT * FROM topics");
    return allTopics.rows;
}