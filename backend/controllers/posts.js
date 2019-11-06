const db = require('../config/connection');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const pool = db.pool;

// // set your env variable CLOUDINARY_URL or set the following configuration
//  cloudinary.config({
//   cloud_name: 'elidayjuma',
//   api_key: '349666467933295',
//   api_secret: '9fa610JUoPi-o88W3sUXfYD0su0'
// }); 


exports.createArticle = async (request, response) => {
  console.log(request.body);
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
  console.log(request.params);
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

exports.createGif = async (request, response) => {
  console.log(request.body);
  try {
    cloudinary.uploader.upload(request.body.gif_url, function(error, result){
      console.log(result, error)
    });
    const {title, user_id, status, gif_url} = request.body

    const newGif = await pool.query('INSERT INTO posts (title, content, user_id, status, gif_url, post_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title, gif_url, post_type', [title, "none", user_id, status, gif_url, 2]);
      
    const newGifResult = newGif.rows[0]
    return response.status(200).json({
      status: "success",
      data: {newGifResult}
    })
  } catch (err) {
    console.log(err)
    response.status(400).json({
      status: "failed",
      data: err
    })
  }
}

