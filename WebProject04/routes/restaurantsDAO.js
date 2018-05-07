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
var restaurant_db = require("../controller/restaurant");

//http://localhost:3000/restaurants/restaurants?keyword=Merde，GET    用keyword查找符合关键词的餐厅，keyword由前端接收表单参数，拼接url，然后用拼接后的url进行ajax get.
// 建立的是复合全文索引，包括restaurant_name,address,type_of_cuisine,description (应该够了吧……)
/*router.get('/restaurants', function (req, res, next) {
    var db = req.db;
    var collection = db.get('restaurant');
    var keyword = req.query.keyword;
    collection.find({$text: {$search: keyword}}, function (err, docs) {
        var result = docs;
        res.json(result);
    });
});*/

router.get('/restaurants', restaurant_db.getRestaurants);

//http://localhost:3000/restaurants/restaurant?restaurant_id=5ad0a6b50052db3bcc7696dd,
// 利用restaurant_id查找对应餐厅的document,同上一个api,由前端接收表单参数，
// 拼接url，然后用拼接后的url进行ajax get
/*router.get('/restaurant', function (req, res, next) {
    var db = req.db;
    var collection = db.get('restaurant');
    var id = monk.id(req.query.restaurant_id);
    var restaurant_id = {'_id': id};
    collection.find(restaurant_id, function (err, docs) {
        res.json(docs);
    })
});*/
router.get('/restaurant', restaurant_db.getRestaurant);

/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //上传图片路径在这里
        cb(null, './public/upload_images')
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var dateString = date.toDateString();
        cb(null, file.originalname);
    }
});*/

/*var upload = multer({storage: storage});
//暂时使用multer去解析multipart/form-data,不用connect-multiparty
//暂时不在post中加入multipartMiddleware
//餐厅官方图片暂定只准上传一张
router.post('/restaurants', upload.single('official_photo'), function (req, res, next) {
    var db = req.db;
    var collection = db.get('restaurant');
    var date = new Date();
    date = date.toDateString();
    //应该通过google map api得到lag,lng,这个给何旭 :>
    var lag = 77.8;
    var lng = 45.8;
    //评分可以由初始新建此餐厅的用户打分，也可以随机生成一个
    var restaurant_rating = req.body.restaurant_rating;
    var file = req.file;
    var path = file.path;
    path = path.toString();
    //去掉public和把\替换成/
    path = path.replace(new RegExp("\\\\", "gm"), "/");
    path = path.replace("public", "");
    console.log(path);
    body = req.body;
    var data = {
        "restaurant_name": body.restaurant_name,
        "address": body.address,
        "type_of_cuisine": body.type_of_cuisine,
        "description": body.description,
        //应该是multipart/form-data上传文件后，通过multer保存文件到服务器上，再保存一个文件（图片）路径到这个字段
        //假设上传的图片名是nihendeyia.jpg
        //插入后的路径是public\upload_images\nihendeyia.jpg
        //http://localhost:3000/upload_images/nihendeyia.jpg可以看到这张图，
        // ejs模板里到时候从json里取出official_photo_url, 然后img src设置一下路径
        //见index.ejs里有一个图的url写法
        "official_photo_url": path,
        "date": date,
        "coordinate": {
            "lat": lag,
            "lng": lng
        },
        "restaurant_rating": restaurant_rating,
        //这两个需要在用户插入photo和review之后update，利用数组的$addToSet和$each
        "photos_id": [],
        "reviews_id": []
    };
    collection.insert(data, function (err, docs) {
        if (err != null) {
            console.log(err);
            res.json(err);
        }
        //成功插入的记录是可以返回json的，可以从返回的json里面拿到生成的_id,这样餐厅页面其他部分，
        // 例如插入由用户上传的图片、插入用户评论都能用到这个restaurant文档_id
        // (因为同时要更新restaurant文档里的photos_id,reviews_id，mongodb没有mysql那样的外键，要么引用别的文档_id,要么内嵌文档，我喜欢第一种)
        res.json(docs);
    });
});*/
router.post('/restaurants', restaurant_db.postRestaurans);
module.exports = router;