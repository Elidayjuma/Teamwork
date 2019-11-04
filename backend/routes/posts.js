const express = require('express');
const post = require('../controllers/posts')

const router = express.Router();

router.post('/', post.createPost)


module.exports = router;