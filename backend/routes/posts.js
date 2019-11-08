const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');
const comment = require('../controllers/comments');

const { resolve }  = require('path')
const { uploader}  = require('../config/cloudinaryConfig')
const { multerUploads, dataUri } = require('../middlewares/multer')

const returnImageUrl = async (request, response, next) => {
    if(!request.file) {
        return response.status(400).json({
            status: "failed",
            data:{
                message: "You have not provided a gif!"
            }
        });
    }
    const file = dataUri(request).content;
    await uploader.upload(file).then((result) => {
        request.body.gif_url = result.url;
        next();
    })
}

//article routes
router.post('/article', post.createArticle);
router.post('/article/:postID/comment', comment.createComment);
router.patch('/article/:articleID', post.updateArticle);
router.delete('/article/:articleID', post.deleteArticle);

//gif routes
router.post('/gif', multerUploads, returnImageUrl ,post.createGif);
router.post('/gif/:postID/comment', comment.createComment);
router.delete('/gif/:gifID', post.deleteGif);


module.exports = router;