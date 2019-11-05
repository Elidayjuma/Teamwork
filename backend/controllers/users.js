// const db = require('../config/connection')
// const pool = db.pool;

// const getUsers = (request, response) => {
//   pool.query('SELECT username, email, phone_no, created_at  FROM users ORDER BY id ASC', (error, results) => {
//     if (error) {
//       response.json({
//         status: "failed",
//         data: {
//           message: error
//         }
//       })
//     }
//     const allusers = results.rows;
//     response.status(200).json({
//       status: "success",
//       data: allusers
//     })
//   })
// }

// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id)

//   pool.query('SELECT username, email, phone_no, created_at FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// }

// const updateUser = (request, response) => {
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

// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id)

//   pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }

// module.exports = {
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// }