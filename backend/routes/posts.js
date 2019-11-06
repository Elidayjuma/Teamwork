const express = require('express');
const router = express.Router();

const post = require('../controllers/posts');
const comment = require('../controllers/comments');

//article routes
router.post('/article', post.createArticle);
router.post('/article/:articleID/comment', comment.createComment);
router.patch('/article/:articleID', post.updateArticle);
router.delete('/article/:articleID', post.deleteArticle);

//gif routes
router.post('/gif', post.createGif);


module.exports = router;