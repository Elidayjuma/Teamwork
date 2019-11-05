const express = require('express');
const user = require('../controllers/users')

const router = express.Router();

router.post('/', user.createUser)
router.post('/login', user.loginUser)
router.get('/', user.getUsers)
// router.get('/:id', user.getUserById)
// router.put('/:id', user.updateUser)
// router.delete('/:id', user.deleteUser)

module.exports = router;