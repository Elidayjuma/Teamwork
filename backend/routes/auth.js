const express = require('express');
const auth = require('../authentication/auth')

const router = express.Router();

router.post('/create-user', auth.createUser)
//router.post('/login', user.loginUser)


module.exports = router;