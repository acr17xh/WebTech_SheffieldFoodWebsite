var express = require('express');
var router = express.Router();
var monk = require('monk');
//导入url模块，暂时用不到
var url = require("url");
//导入querystring模块（解析post请求数据）,暂时用不到，我们利用req.query（GET, url传参数）或者req.body（POST,表单）取值
var queryString = require('querystring');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer = require('multer');
var photo_db = require('../controller/photo');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //上传图片路径在这里
        cb(null, './public/upload_images')
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var dateString = date.toDateString();
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});

router.post('/photos', upload.array('photos', 5), photo_db.postPhotos);

/*function insertPhotoThenUpdateRestaurant(collection, collection2, data) {
    return new Promise(function (resolve, reject) {
        collection.insert(data, function (err, docs) {
            if (err != null) {
                reject(err);
            }
            else {
                resolve(docs);
            }
        });
    });
}*/

router.get('/photos', photo_db.getPhotos);

module.exports = router;