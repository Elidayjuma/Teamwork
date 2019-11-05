const db = require('../config/connection')
const pool = db.pool;

const createPost = async (request, response) => {
    try {
      const {title, content, user_id, status, gif_url, post_type } = request.body
  
      const newPost = await pool.query('INSERT INTO posts (title, content, user_id, status, gif_url, post_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title, content, gif_url, post_type', [title, content, user_id, status, gif_url, post_type]);
        
      const newPostResult = newPost.rows[0]
      return response.status(200).json({
        status: "success",
        data: {newPostResult}
      })
    } catch (err) {
      console.log(err)
      response.json({
        status: "failed",
        data: err
      })
    }
  }

  module.exports = {
    createPost
  }
