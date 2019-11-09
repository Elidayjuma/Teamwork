const express = require('express');
const user = require('../controllers/users');
const auth = require('../authentication/auth');

const router = express.Router();

// router.get('/', auth.checkToken, user.getUsers)
// router.get('/:id', auth.checkToken, user.getUserById)
// router.put('/:id', auth.checkToken, user.updateUser)
// router.delete('/:id', auth.checkToken, user.deleteUser)

module.exports = router;