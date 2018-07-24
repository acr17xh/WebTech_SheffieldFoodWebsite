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


exports.postPhotos = function (req, res) {
    var db = req.db;
    var collection = db.get('photo');
    var collection2 = db.get('restaurant');
    var date = new Date();
    date = date.toDateString();
    var files = req.files;
    var arr = [];
    var count = 0;
    var restaurant_id = monk.id(req.body.restaurant_id);
    for (i = 0, len = files.length; i < len; i++) {
        var file = files[i];
        var path = file.path;
        path = path.toString();
        //去掉public和把\替换成/
        path = path.replace(new RegExp("\\\\", "gm"), "/");
        path = path.replace("public", "");
        var photo_name = file.filename;
        var data = {'photo_name': photo_name, 'date': date, 'user_photo_url': path, 'restaurant_id': restaurant_id};

        insertPhotoThenUpdateRestaurant(collection, collection2, data).then(
            function (docs) {
                console.log(docs);
                collection2.update(restaurant_id, {
                    $push: {'photos_id': docs._id, 'reviews_id': {$each: []}}
                }, {multi: true}, function (err, raw) {
                    if (err != null) {
                        console.log(err);
                    }
                    else {
                        console.log(docs);
                    }
                });
            },
            function (err) {
                console.log("Error!");
                console.log(err);
                console.log(docs);
            }
        );
        count++;
    }
    msg = {'info': 'Phots uploaded!', 'count': count};
    res.json(msg);
};


function insertPhotoThenUpdateRestaurant(collection, collection2, data) {
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
}


exports.getPhotos = function (req, res) {
    console.log(req.query.restaurant_id);
    var db = req.db;
    var collection = db.get('photo');
    var restaurant_id = monk.id(req.query.restaurant_id);
    restaurant_id = {'restaurant_id': restaurant_id};
    collection.find(restaurant_id, {}, function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
}