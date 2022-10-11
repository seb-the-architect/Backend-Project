const pool = require("../db/connection.js")

exports.queryAllTopics = async function()
{
    const allTopics = await pool.query("SELECT * FROM topics");
    return allTopics.rows;
}

exports.queryArticle = async function(id)
{
    const article = await pool.query(`
    SELECT article_id, title, topic, users.name, created_at, votes
    FROM articles
    LEFT JOIN users
    ON articles.author=users.username
    WHERE article_id=$1;`, [id]);

    return article.rows[0];
}

exports.queryAllUsers = async function()
{
    const allUsers = await pool.query("SELECT * FROM users");
    return allUsers.rows;
}