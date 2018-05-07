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
var review_db = require('../controller/review');

router.get('/reviews', review_db.getReviews);

router.post('/reviews', review_db.postReviews);

module.exports = router;