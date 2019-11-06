const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');

//article routes
router.post('/article', post.createArticle);
router.patch('/article/:articleID', post.updateArticle);
router.delete('/article/:articleID', post.deleteArticle);

//gif routes
router.post('/gif', post.createGif);


module.exports = router;