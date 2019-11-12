const db = require('../config/connection')
const pool = db.pool;

exports.getUsers = (request, response) => {
  pool.query('SELECT id, username, email, phone_no, created_date  FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.json({
        status: "failed",
        data: {
          message: error
        }
      })
    }
    const allusers = results.rows;
    return response.status(200).json({
      status: "success",
      data: allusers
    })
  })
}

exports.getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT id, username, email, phone_no, created_date FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.json({
        status: "failed",
        data: {
          message: error
        }
      })
    }
    const UserDetails = results.rows
    return response.status(200).json({
      status: "success",
      data: UserDetails
    })
  })
}

// exports.updateUser = (request, response) => {
//   const id = parseInt(request.params.id)
//   const { name, email } = request.body

//   pool.query(
//     'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }

exports.deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  // pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
  pool.query(`DELETE FROM users WHERE id = $1`, [id], (error, results) => {
    if (error) {
      console.log(error)
      return response.json({
        status: "failed",
        data: {
          message: error
        }
      })
    }
    return response.status(200).json({
      status: "success",
      data: {
        message: "User deleted Successfully"
      }
    })
  })
}
