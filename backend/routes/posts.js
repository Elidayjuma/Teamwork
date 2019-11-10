const express = require('express');
const router = express.Router();
const post = require('../controllers/posts');
const comment = require('../controllers/comments');
const auth = require('../authentication/auth');

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
//feeds routes
router.get('/',auth.checkToken, post.getFeeds);

//article routes
router.post('/article',auth.checkToken, post.createArticle);
router.post('/article/:postID/comment',auth.checkToken, comment.createComment);
router.post('/article/:articleID/like', auth.checkToken, post.likeArticle);
router.post('/article/:postID/flag', auth.checkToken, post.flagArticle);
router.get('/article/:articleID',auth.checkToken, post.getArticle);
router.patch('/article/:articleID',auth.checkToken, post.updateArticle);
router.delete('/article/:articleID', auth.checkToken, auth.checkUserRole, post.deleteArticle);
router.delete('/article/:articleID/comment/:commentID', auth.checkToken, auth.checkUserRole, comment.deleteComment);

//gif routes
router.post('/gif',auth.checkToken, multerUploads, returnImageUrl ,post.createGif);
router.post('/gif/:postID/comment',auth.checkToken, comment.createComment);
router.delete('/gif/:gifID',auth.checkToken, post.deleteGif);
router.delete('/gif/:gifID/comment/:commentID', auth.checkToken, auth.checkUserRole, comment.deleteComment);

module.exports = router;