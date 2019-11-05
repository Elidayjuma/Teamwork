const express = require('express');
const post = require('../controllers/posts')

const router = express.Router();

router.post('/article', post.createArticle)


module.exports = router;