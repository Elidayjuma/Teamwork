const db = require('../config/connection')
const pool = db.pool;


exports.createArticle = async (req, response) => {
  console.log(req.body);
    try {
      const {title, content, user_id, status, post_type } = request.body
  
      const newPost = await pool.query('INSERT INTO posts (title, content, user_id, status, gif_url, post_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title, content, gif_url, post_type', [title, content, user_id, status, "none", post_type]);

      const newPostResult = newPost.rows[0]
      return response.status(200).json({
        status: "success",
        data: {newPostResult}
      })
    } catch (err) {
      console.log(err)
      response.status(200).json({
        status: "failed",
        data: err
      })
    }
  }

  exports.createGif = async (request, response) => {
    try {
      const {title, user_id, status, gif_url} = request.body
  
      const newGif = await pool.query('INSERT INTO posts (title, content, user_id, status, gif_url, post_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title, gif_url, post_type', [title, "none", user_id, status, gif_url, 2]);
        
      const newGifResult = newGif.rows[0]
      return response.status(200).json({
        status: "success",
        data
      })
    } catch (err) {
      console.log(err)
      response.status(400).json({
        status: "failed",
        data: err
      })
    }
  }
