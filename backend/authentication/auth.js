const db = require('../config/connection');
const bcrypt = require('bcrypt');
const pool = db.pool;

const createUser = async (request, response) => {
    try {
      let email = request.body.email.toLowerCase();
      let username = request.body.username.toLowerCase();
      const { phone_no, first_name, last_name, avatar, job_position, department, user_address } = request.body

      let initialPassword = bcrypt.hashSync(phone_no.toString(), 10);
     
      const newUser = await pool.query(`
        INSERT INTO users (
        username, password, email, phone_no) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, username, email, phone_no`,
        [username, initialPassword, email, phone_no]);
      const newUserDetails = await pool.query(
      `INSERT INTO user_details (
        first_name, last_name, user_id, avatar, job_position, department, user_address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING first_name, last_name`, [first_name, last_name, newUser.rows[0].id, avatar, job_position, department, user_address]);
      const roleUser = await pool.query('INSERT INTO role_users (user_id, role_id) VALUES ($1, $2)', [newUser.rows[0].id, 3]);
  
      const newUserResult = newUser.rows[0]
      const newUserDetailsResult = newUserDetails.rows[0]
      return response.status(200).json({
        status: "success",
        data: {newUserResult, newUserDetailsResult}
      })
    } catch (err) {
      console.log(err)
      response.status(500).json({
        status: "failed",
        data: {
          message: "Internal server error"
        }
      })
    }
  }
 
const loginUser = async (request, res) => {
    try {
      const {email, password} = request.body
     
      const doesUserExist = await pool.query('SELECT LOWER (email), password FROM users WHERE email like $1', [email])
      if (doesUserExist.rowCount<1) {
        return res.status(404).json({
          status: "failed",
          data: {
            message: "Wrong password or email provided nonex"
          }
        })
      } else {
        const passwordCheck = await bcrypt.compare(password, doesUserExist.rows[0].password );
        if (passwordCheck == true) {
          return res.status(200).json({
            status: "success",
            data: {
              message: "The login was successfull",
              user: doesUserExist
            }
          })
        }else {
          return res.status(401).json({
            status: "failed",
            data: {
              message: "Wrong password or email provided"
            }
          })
        } 
      }
    } catch (err) {
        console.log (err)
        return res.json({
          status: "failed",
          data: {
            message: err
          }
        })
    }
  }
  
  module.exports = {
    createUser,
    loginUser
  }