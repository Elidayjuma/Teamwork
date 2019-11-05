const db = require('../config/connection')
const pool = db.pool;

const createUser = async (request, response) => {
    try {
      let email = request.body.email.toLowerCase();
      let username = request.body.username.toLowerCase();
      const {password, phone_no, first_name, last_name, avatar, job_position, department, user_address } = request.body
  
      const newUser = await pool.query('INSERT INTO users (username, password, email, phone_no) VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone_no', [username, password, email, phone_no]);
      const newUserDetails = await pool.query('INSERT INTO user_details (first_name, last_name, user_id, avatar, job_position, department, user_address) VALUES ($1, $2, $3, $4, $5, $6, $7)', [first_name, last_name, newUser.rows[0].id, avatar, job_position, department, user_address]);
      const roleUser = await pool.query('INSERT INTO role_users (user_id, role_id) VALUES ($1, $2)', [newUser.rows[0].id, 3]);
  
      const newUserResult = newUser.rows[0]
      const newUserDetailsResult = newUserDetails.rows[0]
      return response.status(200).json({
        status: "success",
        data: {newUserResult, newUserDetailsResult}
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
    createUser
  }