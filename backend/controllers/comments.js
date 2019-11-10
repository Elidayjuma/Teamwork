const db = require('../config/connection');
const pool = db.pool;


exports.createComment = async (request, response) => {
    try{
        const { content, user_id} = request.body
        const newComment = await pool.query(`
          INSERT INTO comments 
          (content, user_id, post_id, status) 
          VALUES ($1, $2, $3, $4) 
          RETURNING content, status`, 
          [content, user_id, request.params.postID, 1]);
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

exports.deleteComment =async (request, response) => {
  try {
    const whoPostedTheComment = await pool.query(`SELECT * FROM comments WHERE id=$1`, [request.params.commentID]);
    if (whoPostedTheComment.rowCount != 0){
      if(whoPostedTheComment.rows[0].user_id == request.body.user_id || (whoPostedTheComment.rows[0].status != 1 && request.body.creator_id == 2)) {
       const deletedComment = await pool.query(`DELETE FROM comments WHERE id=$1`, [request.params.commentID]);
        return response.status(200).json({
          status: "success",
          data: {
            message: "Comment deleted successfully"
          }
        })
      } else {
        return response.status(400).json({
          status: "failed",
          data: {
            message: "You can not delete a comment that isn't yours"
          }
        })
      }
    } else {
      return response.status(400).json({
        status: "failed",
        data: {
          message: "This comment is not available"
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
