const db = require('../config/connection')
const pool = db.pool;

const getUsers = (request, response) => {
  try{
    pool.query('SELECT username, email, phone_no, created_at  FROM users ORDER BY id ASC', (error, results) => {
      const allusers = results.rows;
      response.status(200).json({
        status: "success",
        data: allusers
      })
    })
  } catch(err) {
    response.status(400).json({
      status: "failed",
      data: {
        message: err
      }
    })
  }
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT username, email, phone_no, created_at FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = async (request, response) => {
  try {
    const {password, phone_no, first_name, last_name, avatar, job_position, department, user_address } = request.body
    let email = request.body.email.toLowerCase();
    let username = request.body.username.toLowerCase();

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

const loginUser = async (request, res) => {
  try {
    const {email, password} = request.body
    
    const doesUserExist = await pool.query('SELECT LOWER (email), password FROM users WHERE email like $1', [email])
    if (doesUserExist.rowCount<1) {
      return res.status(404).json({
        status: "failed",
        data: {
          message: "User does not exist"
        }
      })
    } else {
      if (doesUserExist.rows[0].password === password) {
        return res.status(200).json({
          status: "success",
          data: {
            message: "The login was successfull",
            user: doesUserExist
          }
        })
      } else {
        return res.status(401).json({
          status: "failed",
          data: {
            message: "Wrong password detected"
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

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
}