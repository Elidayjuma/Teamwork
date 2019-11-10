const express = require('express');
const auth = require('../authentication/auth')

const router = express.Router();

router.post('/create-user', auth.checkToken, auth.checkUserRole, auth.createUser)
router.post('/signin', auth.loginUser)


module.exports = router;