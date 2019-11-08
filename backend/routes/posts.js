const express = require('express');
const router = express.Router();
const post = require('../controllers/posts')

const { resolve }  = require('path')
const { uploader}  = require('../config/cloudinaryConfig')
const { multerUploads, dataUri } = require('../middlewares/multer')


// // set your env variable CLOUDINARY_URL or set the following configuration
// cloudinary.config({
//     cloud_name: 'elidayjuma',
//     api_key: '349666467933295',
//     api_secret: '9fa610JUoPi-o88W3sUXfYD0su0'
//   }); 

// const gifsOptions = {
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 1024 * 1024 *5
//     },
//     fileFilter: (req, file, next) => {
//         if(file.mimetype.startsWith('image/')){
//             next(null, true);
//         } else {
//             next(null, false);
//         }
//     }
// };

// const upload =  multer(gifsOptions).single('gif_url');

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


router.post('/article', post.createArticle);
router.post('/gif', multerUploads, returnImageUrl ,post.createGif);


module.exports = router;