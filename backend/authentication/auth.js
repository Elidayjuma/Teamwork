const db = require('../config/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = db.pool;

exports.createUser = async (request, response) => {
  try {
    let email = request.body.email.toLowerCase();
    let username = request.body.username.toLowerCase();
    const { phone_no, first_name, last_name, avatar, job_position, department, user_address, creator_id } = request.body

    if (creator_id == 2 || creator_id == 1) {

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
        data: { newUserResult, newUserDetailsResult }
      })
    } else {
      return response.status(403).json({
        status: "failed",
        error: "You have no permission to create an employee"
        
      })
    }
  } catch (err) {
    console.log(err)
    response.status(500).json({
      status: "failed",
      error: {
        message: "Internal server error",
        detail: err.detail
      }
    })
  }
}

exports.loginUser = async (request, res) => {
  try {
    const { email, password } = request.body

    const doesUserExist = await pool.query('SELECT * FROM users WHERE email like $1', [email])
    if (doesUserExist.rowCount < 1) {
      return res.status(404).json({
        status: "failed",
        data: {
          message: "Wrong password or email provided nonex"
        }
      })
    } else {
      const passwordCheck = await bcrypt.compare(password, doesUserExist.rows[0].password);
      if (passwordCheck == true) {
        const token = jwt.sign({ userId: doesUserExist.rows[0].id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '30d' });
        const userDetails = await pool.query('SELECT * FROM user_details WHERE user_id = $1', [doesUserExist.rows[0].id])

        console.log(userDetails.rowCount)
        if (userDetails.rowCount != 0) {
          const job_position_name = await pool.query(`SELECT name FROM job_positions WHERE id = $1`, [userDetails.rows[0].job_position]);
          const dapartment_name = await pool.query(`SELECT name FROM departments WHERE id = $1`, [userDetails.rows[0].department]);
          return res.status(200).json({
            status: "success",
            data: {
              message: "The login was successfull",
              user_ID: doesUserExist.rows[0].id,
              username: doesUserExist.rows[0].username,
              email: doesUserExist.rows[0].email,
              first_name: userDetails.rows[0].first_name,
              last_name: userDetails.rows[0].last_name,
              job_position: job_position_name.rows[0].name,
              department: dapartment_name.rows[0].name,
              avatar: userDetails.rows[0].avatar,
              address: userDetails.rows[0].user_address,
              token: token
            }
          })
        } else {
          return res.status(200).json({
            status: "success",
            data: {
              message: "The login was successfull",
              user_ID: doesUserExist.rows[0].id,
              username: doesUserExist.rows[0].username,
              email: doesUserExist.rows[0].email,
              token: token
            }
          })
        }
      } else {
        return res.status(401).json({
          status: "failed",
          error: "Wrong password or email provided"
          
        })
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: "failed",
      error: "Internal Server Error!"
    })
  }
}

exports.checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    jwt.verify(header, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({
          "Success": "false",
          "status": 500,
          "accesstoken": null,
          "Message": "Failed to authenticate" + err
        });

      }
      req.body.user_id = decoded.userId
      next();
    });

  } else {
    //If header is undefined return Forbidden (403)
    res.status(403).json({
      "message": "You are not authorized!",
      status: 403
    })
  }
}

exports.checkUserRole = async (request, response, next) => {
  const userRole = await pool.query(`SELECT role_id FROM role_users WHERE user_id = $1`, [request.body.user_id])
  request.body.creator_id = userRole.rows[0].role_id
  next();
}
