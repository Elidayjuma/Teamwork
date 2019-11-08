const db = require('../config/connection');
const pool = db.pool;


exports.createComment = async (request, response) => {
    try{
        const { content, user_id} = request.body
        const newComment = await pool.query('INSERT INTO comments (content, user_id, post_id, status) VALUES ($1, $2, $3, $4) RETURNING content, status', [content, user_id, request.params.postID, 1]);
        const newCommentResult = newComment.rows[0]
        return response.status(200).json({
            status: "success",
            data: { newCommentResult }
        })

    } catch (err) {
        console.log(err)
        response.status(400).json({
          status: "failed",
          data: err
        })
      }

}