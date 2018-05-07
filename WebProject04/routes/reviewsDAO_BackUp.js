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

router.get('/reviews', function (req, res, next) {
    var db = req.db;
    var collection = db.get('review');
    var restaurant_id = monk.id(req.query.restaurant_id);
    restaurant_id = {'restaurant_id': restaurant_id};
    collection.find(restaurant_id, {}, function (err, docs) {
        res.json(docs);

    });
});

router.post('/reviews', function (req, res, next) {
    var db = req.db;
    var collection = db.get('review');
    var date = new Date();
    date = date.toDateString();
    var review_description = req.body.review_description;
    var ratings = req.body.ratings;
    ratings = parseInt(ratings, 10);
    var username = req.body.username;
    var restaurant_id = monk.id(req.body.restaurant_id);
    var data = {
        'review_description': review_description,
        'ratings': ratings,
        'username': username,
        'date': date,
        'restaurant_id': restaurant_id
    };
    var collection2 = db.get('restaurant');

    insertReviewThenUpdateRestaurant(collection, collection2, data).then(
        function (docs) {
            console.log(docs);
            collection2.update(restaurant_id, {
                $push: {'photos_id': {$each: []}, 'reviews_id': docs._id}
            }, {multi: true}, function (err, raw) {
                if (err != null) {
                    res.json(err);
                }
                else {
                    res.json(docs);
                }
            });
        }, function (err) {
            res.json(err);
        }
    );
});

function insertReviewThenUpdateRestaurant(collection, collection2, data) {
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

module.exports = router;