//这个js仅仅作为测试用!
var express = require('express');
var router = express.Router();
var monk = require('monk');
//导入url模块
var url = require("url");
//导入querystring模块（解析post请求数据）
var queryString = require('querystring');

/*router.get('/', function (req, res, next) {
    res.send('dbOperations');
});*/

router.get('/find', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.post('/insert', function (req, res) {
        var db = req.db;
        var restaurant = db.get('restaurant');
        var body = req.body;
        var date = new Date();
        date = date.toDateString();
        //应该通过google map api得到
        var lag = 77.8;
        var lng = 45.8;
        //可以由初始用户打分，也可以随机生成一个
        var restaurant_rating = '4';
        var data = {
            "restaurant_name": body.restaurant_name,
            "address": body.address,
            "type_of_cuisine": body.type_of_cuisine,
            "description": body.description,
            //应该是multipart/form-data上传文件后，通过multer上传到服务器上，保存一个路径给这个字段
            "official_photo_url": body.path,
            "date": date,
            "coordinate": {
                "lat": lag,
                "lng": lng
            },
            "restaurant_rating": restaurant_rating,
            //这两个需要在插入photo和review之后update
            "photos_id": [],
            "reviews_id": []
        };

        var msg = {'insert_information': 'Insert successfully!'};
        restaurant.insert(data, function (err, result) {
            if (err != null) {
                msg = err;
            }
        });
        res.json(body);
    }
);

router.delete('/delete', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var deleteid = req.query.deleteid;
    console.log(deleteid);
    collection.remove({'_id': deleteid}, function (err) {
        res.json((err === null) ? {msg: 'Delete successfully!'} : {msg: 'error: ' + err});
    });
});

router.put('/update', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var updateid = {'_id': req.query.updateid};
    //用户上传图片后返回photo的_id，然后push
    //上传多张图片的话，要么循环push each进数组
    var update_photos_id2 = monk.id('5ace35bf872c43754ac80e66');
    var update_photos_id = [monk.id('5ace35bf872c43754ac80e68'), monk.id('5ace35bf872c43754ac80e69'), monk.id('5ace35bf872c43754ac80e70')];
    //用户上传评论后返回review的_id,push
    var update_reviews_id2 = monk.id('5ace3552872c43754ac80e65');
    var msg = {msg: 'Update successfully!'};
    collection.update(updateid, {
        /* $set: {
             'photos_id': update_photos_id,
             'reviews_id': update_reviews_id
         }*/
        $push: {'photos_id': {$each: update_photos_id}, 'reviews_id': update_reviews_id2}
    }, {multi: true}, function (err, raw) {
        if (err != null) {
            res.json(err);
        }
        else {
            res.json(msg);
        }
    });
});

module.exports = router;
