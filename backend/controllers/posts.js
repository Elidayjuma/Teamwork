const db = require('../config/connection');
const pool = db.pool;

exports.getFeeds = async (request, response) => {
  try {
    const postFeeds = await pool.query(`
      SELECT * FROM posts
      ORDER BY created_date DESC`);
      posts = postFeeds.rows;
      return response.json({
       status: "success",
       data: {
        posts
       }
      })

  } catch (err) {
    return response.status(500).json({
      status: "failed",
      data: {
        message: "Server error!"
      }
    })
  }
}

exports.getManyArticles = async (request, response) => {
  try {
    if( Object.keys(request.query).length != 0) {
      console.log(request.query.tag)
      const articleFeedsByTag = await pool.query(`
        SELECT * FROM posts_tags 
        LEFT JOIN posts ON posts_tags.id=posts.id 
        WHERE post_tag_id=$1`,[request.query.tag]);
        return response.status(200).json({
          status: "success",
          data: {
            articleFeedsByTag
          }
        })

    }else {
      const articleFeeds = await pool.query(`
        SELECT * FROM posts
        WHERE post_type=$1
        ORDER BY created_date DESC`,[1]);
        posts = articleFeeds.rows;
        return response.status(200).json({
         status: "success",
         data: {
          posts
         }
        })
    }

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
        posts.created_date AS post_created_at,
        comments.id AS comment_id,
        comments.status AS comment_status,
        comments.content AS comment_content,
        comments.user_id AS comment_user_id,
        comments.created_date AS comment_created_at,
        post_likes.user_id AS likers,
        posts_tags.post_tag_id As tags_id
      FROM posts
      LEFT JOIN comments ON posts.id=comments.post_id
      LEFT JOIN post_likes ON posts.id=post_likes.post_id
      LEFT JOIN posts_tags ON posts.id=posts_tags.post_id
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
    //for each row, push the likers into a likers array
    let likers = [];
    if (article[0].likers == null) {
      comments.push(null)
    } else{
      for (let i = 0; i < article.length; i++) {
        console.log(article[0].likers);
        let like = {
          user_id: article[i].likers
        }
        likers.push(like);
      }
    }
    //for eacch row, push the post_tas into a tags array
    let tags =[];
    if (article[0].tags_id == null) {
      tags.push(null)
    } else {
      for (let i = 0; i < article.length; i++) {
        const tagName = await pool.query(`SELECT name FROM post_tags WHERE id=$1`,[article[i].tags_id])
        let tag = {
          tag: tagName.rows[0].name
        }
        tags.push(tag)
      }
    }

    return response.status(200).json({
      status: "success",
      data: {
        post_content,
        comments,
        likers,
        tags
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

exports.getArticleByTag = async (request, response) => {
  try{
    console.log("getting article by tagID")
    console.log(request)

  }catch (err) {
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
    const { title, content, user_id} = request.body
    const status = 1;
    const newPost = await pool.query(`INSERT INTO posts (
      title, content, user_id, status, gif_url, post_type) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, title, content, post_type`, 
      [title, content, user_id, status, "none", 1]);

    const insertedTags = await pool.query(`INSERT INTO posts_tags (
      post_id, post_tag_id) 
      VALUES ($1, $2)`, 
      [newPost.rows[0].id, request.body.tag]);

    const newPostResult = newPost.rows[0]
    return response.status(200).json({
      status: "success",
      data: { 
        newPostResult,
        post_tag: request.body.tag
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

exports.updateArticle = async (request, response) => {
  try{
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    const { title, content, user_id, status } = request.body

    const whoPostedTheArticle = await pool.query(`SELECT * FROM posts WHERE id=$1`, [request.params.articleID]);
    if (whoPostedTheArticle.rowCount != 0){

      if(whoPostedTheArticle.rows[0].user_id == request.body.user_id){
       const updatedPost = await pool.query(`
          UPDATE posts SET title=$1, content=$2, user_id=$3, status=$4, gif_url=$5, post_type=$6, modified_date=$8 
          WHERE id=$7 RETURNING title, content, post_type, status`, 
          [title, content, user_id, 1, "none", 1, request.params.articleID, dateTime ]);
        const newPostResult = updatedPost.rows[0]
        return response.status(200).json({
          status: "success",
          data: { newPostResult }
        })
      } else {
        return response.status(400).json({
          status: "failed",
          data: {
            message: "You can only update your own posts"
          }
        })
      }
    }else {
      return response.status(400).json({
        status: "failed",
        data: {
          message: "This post is not available"
        }
      })
    }

  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: {
        message: "Internal server error!"
      }
    })
  } 
}

exports.deleteArticle =async (request, response) => {
  try {
    console.log(request.body.user_id)
    const whoPostedTheArticle = await pool.query(`SELECT * FROM posts WHERE id=$1`, [request.params.articleID]);
    if (whoPostedTheArticle.rowCount != 0){
      if(whoPostedTheArticle.rows[0].user_id == request.body.user_id || (whoPostedTheArticle.rows[0].status != 1 && request.body.creator_id == 2)) {
       const deletedArticle = await pool.query(`DELETE FROM posts WHERE id=$1`, [request.params.articleID]);
        return response.status(200).json({
          status: "success",
          data: {
            message: "Article deleted successfully"
          }
        })
      } else {
        return response.status(400).json({
          status: "failed",
          data: {
            message: "You can not delete a post that isn't yours"
          }
        })
      }
    } else {
      return response.status(400).json({
        status: "failed",
        data: {
          message: "This post is not available"
        }
      })
    }
  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: {
        message: "Internal server error!"
      }
    })
  } 
}

exports.flagArticle = async (request, response) => {
  try{
    console.log("flagged!")
    const {content, user_id } = request.body
    const isPostAvailable = await pool.query(`SELECT * FROM posts WHERE id=$1`, [request.params.postID]);

    if(isPostAvailable.rowCount != 0) {
      const updatePost = await pool.query(`
            UPDATE posts SET status=$1 
            WHERE id=$2`, 
            [2, request.params.postID ]);
      
      const newFlag = await pool.query(`
          INSERT INTO flagged_posts 
          (content, user_id, post_id, status) 
          VALUES ($1, $2, $3, $4) 
          RETURNING content, status`, 
          [content, user_id, request.params.postID, 1]);

      response.status(200).json({
        status: "success",
        data: {
          message: "Flagged"
        }
      })
    } else {
      response.status(404).json({
        status: "failed",
        data: {
          message: "This post doesn't exist"
        }
      })
    }

  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: {
        message: "Internal server error!"
      }
    })
  } 
}

exports.likeArticle = async (request, response, next) => {
  try {
    const{user_id} = request.body
    const checkIfAlreadyLiked = await pool.query(`
      SELECT * FROM post_likes WHERE user_id=$1 AND post_id=$2`,[user_id, request.params.articleID]);
    if( checkIfAlreadyLiked.rowCount == 0) {
      await pool.query(`
        INSERT INTO post_likes (user_id, post_id)
        VALUES ($1,$2)`, [user_id, request.params.articleID])
        console.log("liked!")
        return response.status(200).json({
          status: "success",
          data: {
            message: "liked"
          }
        })
    } else {
      await pool.query(`
        DELETE FROM post_likes
        WHERE user_id=$1`,[user_id])
        console.log("un-liked!")
        return response.status(200).json({
          status: "success",
          data: {
            message: "unliked"
          }
        })
    }

  }catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: "Internal Server Error"
    })
  }
}

exports.createGif = async (request, response) => {
  try {
    const { title, user_id, status, gif_url } = request.body

    const newGif = await pool.query(`
      INSERT INTO posts (title, content, user_id, status, gif_url, post_type) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, user_id, title, gif_url, post_type`, [title, "none", user_id, status, gif_url, 2]);

    const insertedTags = await pool.query(`INSERT INTO posts_tags (
        post_id, post_tag_id) 
        VALUES ($1, $2)`,
      [newGif.rows[0].id, request.body.tag]);

    const newGifResult = newGif.rows[0]
    return response.status(200).json({
      status: "success",
      data: {
        newGifResult,
        post_tag: request.body.tag
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

exports.deleteGif =async (request, response) => {
  try {
    const whoPostedTheGif = await pool.query(`SELECT * FROM posts WHERE id=$1`, [request.params.gifID]);
    if (whoPostedTheGif.rowCount != 0){
      if(whoPostedTheGif.rows[0].user_id == request.body.user_id || (whoPostedTheGif.rows[0].status != 1 && request.body.creator_id == 2)) {
       const deletedGif = await pool.query(`DELETE FROM posts WHERE id=$1`, [request.params.gifID]);
        return response.status(200).json({
          status: "success",
          data: {
            message: "Gif deleted successfully"
          }
        })
      } else {
        return response.status(400).json({
          status: "failed",
          data: {
            message: "You can not delete a post that isn't yours"
          }
        })
      }
    } else {
      return response.status(400).json({
        status: "failed",
        data: {
          message: "This post is not available"
        }
      })
    }
  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: {
        message: "Internal server error!"
      }
    })
  } 
}

exports.flagGif = async (request, response) => {
  try{
    console.log("flagged!")
    const {content, user_id } = request.body
    const isPostAvailable = await pool.query(`SELECT * FROM posts WHERE id=$1`, [request.params.postID]);
    console.log(isPostAvailable.rows[0])

    if(isPostAvailable.rowCount != 0) {
      const updatePost = await pool.query(`
            UPDATE posts 
            SET status=$1
            WHERE id=$2`, 
            [2, request.params.postID]);
      
      const newFlag = await pool.query(`
          INSERT INTO flagged_posts 
          (content, user_id, post_id, status) 
          VALUES ($1, $2, $3, $4) 
          RETURNING content, status`, 
          [content, user_id, request.params.postID, 1]);

      response.status(200).json({
        status: "success",
        data: {
          message: "Flagged"
        }
      })
    } else {
      response.status(404).json({
        status: "failed",
        data: {
          message: "This post doesn't exist"
        }
      })
    }

  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      data: {
        message: "Internal server error!"
      }
    })
  } 
}