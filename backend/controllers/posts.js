const db = require('../config/connection');
const pool = db.pool;

exports.getFeeds = async (request, response) => {
  try {
    const postFeeds = await pool.query(`
      SELECT * FROM posts
      ORDER BY created_at DESC`);
      posts = postFeeds.rows;
      return response.json({
       status: "success",
       data: {
        posts
       }
      })

  } catch (err) {

  }
}

exports.getArticle = async (request, response) => {
  try {
    const singleArticle = await pool.query(`
      SELECT 
        posts.id AS post_id,
        posts.title AS post_tile,
        posts.status AS post_status,
        posts.user_id As posted_by_id,
        posts.content AS post_content,
        posts.gif_url AS post_gif_URL,
        posts.created_at AS post_created_at,
        comments.id AS comment_id,
        comments.status AS comment_status,
        comments.content AS comment_content,
        comments.user_id AS comment_user_id,
        comments.created_at AS comment_created_at
      FROM posts
      LEFT JOIN comments 
      ON posts.id=comments.post_id
      WHERE posts.id=$1`,
      [request.params.articleID]);
    article = singleArticle.rows;
    //take the post content form the first row
    const post_content = {
      id: article[0].post_id,
      post_title: article[0].post_title,
      post_status: article[0].post_status,
      posted_by_id: article[0].posted_by_id,
      post_content: article[0].post_content,
      post_gif_url: article[0].post_gif_url,
      post_created_at: article[0].post_created_at,

    }
    //for each row, push the comment content into comments array
    let comments = [];
    if (article[0].comment_id == null) {
      comments.push(null)
    } else{
      for (let i = 0; i < article.length; i++) {
        console.log(article[0].comment_id);
        let comment = {
          comment_id: article[i].comment_id,
          comment_content: article[i].comment_content,
          comment_status: article[i].comment_status,
          comment_posted_by: article[i].comment_user_id,
          comment_created_at: article[i].comment_created_at
        }
        comments.push(comment);
      }
    }

    return response.status(200).json({
      status: "success",
      data: {
        post_content,
        comments
      }
    })

  } catch (err) {
    console.log(err)
    return response.status(500).json({
      status: "failed",
      data: {
        message: "Server error!"
      }
    })
  }
}

exports.createArticle = async (request, response) => {
  try {
    const { title, content, user_id, status } = request.body

    const newPost = await pool.query('INSERT INTO posts (title, content, user_id, status, gif_url, post_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title, content, post_type, status', [title, content, user_id, status, "none", 1]);

    const newPostResult = newPost.rows[0]
    return response.status(200).json({
      status: "success",
      data: { newPostResult }
    })
  } catch (err) {
    console.log(err)
    response.status(400).json({
      status: "failed",
      data: err
    })
  }
}

exports.updateArticle = async (request, response) => {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  try{
    const { title, content, user_id, status } = request.body

    const updatedPost = await pool.query('UPDATE posts SET title=$1, content=$2, user_id=$3, status=$4, gif_url=$5, post_type=$6, updated_at=$8 WHERE id=$7 RETURNING title, content, post_type, status', [title, content, user_id, status, "none", 1, request.params.articleID, dateTime ]);
    const newPostResult = updatedPost.rows[0]
    return response.status(200).json({
      status: "success",
      data: { newPostResult }
    })
  } catch (err) {
    console.log(err)
    response.status(400).json({
      status: "failed",
      data: err
    })
  } 
}

exports.deleteArticle =async (request, response) => {
  try {
    const deletedArticle = await pool.query('DELETE FROM posts WHERE id=$1', [request.params.articleID]);
    return response.status(200).json({
      status: "success",
      data: {
        message: "Article deleted successfully"
      }
    })
  } catch (err) {
    console.log(err)
    response.status(400).json({
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
      data: {
        newGifResult
      }
    })
  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: "Internal Server Error"
    })
  }
}

exports.deleteGif = async (request, response) => {
  try {
    const deletedGif = await pool.query('DELETE FROM posts WHERE id=$1', [request.params.gifID]);
    return response.status(200).json({
      status: "success",
      data: {
        message: "Gif deleted successfully"
      }
    })
  } catch (err) {
    response.status(500).json({
      status: "failed",
      data: "Internal Server Error"
    })
  }
}

