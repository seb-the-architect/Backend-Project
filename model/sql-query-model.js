const pool = require("../db/connection.js")
const format = require("pg-format");

exports.queryAllTopics = async function()
{
    const allTopics = await pool.query("SELECT * FROM topics");
    return allTopics.rows;
}

exports.queryArticle = async function(id)
{
    const article = await pool.query(`
    SELECT article_id, title, topic, users.name as author, created_at, votes, body
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

exports.queryPatchArticle = async function(id, incrObject)
{
    const patchedArticle = await pool.query(`
    UPDATE articles
    SET votes=votes+$1
    WHERE article_id=$2
    RETURNING *`, [incrObject.inc_votes, id]);

    return patchedArticle.rows[0];
}

exports.queryAllComments = async function(article_id)
{
    const allComments = await pool.query(`
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id=$1
    ORDER BY created_at DESC`, [article_id]);

    return allComments.rows;
}

exports.queryAllArticles = async function(topic, sort_by, order)
{
    const allArticles = await pool.query(
        format(`
        SELECT * FROM articles %s
        ORDER BY %s %s;`, (topic ? `WHERE topic='${topic}'` : ""), (sort_by ? sort_by : "created_at"), (order ? order : "DESC")));

    return allArticles.rows;
}

exports.queryPostNewComment = async function(article_id, newComment)
{
    const postedComment = await pool.query(
        format(`
        INSERT INTO comments (body, author, article_id)
        VALUES ('%s', '%s', %s)
        RETURNING *;`, newComment.body, newComment.username, article_id));
    
        return postedComment.rows[0];
}

exports.queryDeleteComment = async function(comment_id)
{
    await pool.query("DELETE FROM comments WHERE comment_id=$1", [comment_id]);
}