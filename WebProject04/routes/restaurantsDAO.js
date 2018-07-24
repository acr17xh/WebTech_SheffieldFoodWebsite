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

//导入controller
var restaurant_db = require("../controller/restaurant");


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

//http://localhost:3000/restaurants/restaurants?keyword=Merde，GET    用keyword查找符合关键词的餐厅，keyword由前端接收表单参数，拼接url，然后用拼接后的url进行ajax get.
//建立复合全文索引，包括restaurant_name,address,type_of_cuisine,description

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

router.post('/restaurants', upload.single('official_photo'),restaurant_db.postRestaurans);

module.exports = router;