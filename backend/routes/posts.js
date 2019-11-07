const express = require('express');
const post = require('../controllers/posts')
const bodyParser = require('body-parser');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/article', post.createArticle);
router.post('/gif', urlencodedParser, post.createGif);


module.exports = router;