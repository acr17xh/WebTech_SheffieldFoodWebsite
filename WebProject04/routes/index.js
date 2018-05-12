var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Sheffield Food'});
});

/*跳转到restaurant.ejs的路由*/
router.get('/restaurant', function (req, res, next) {
    var _id = req.query.restaurant_id;

    // restaurant_id这个值一起带过去，因为在restaurant.ejs页面初始化要发起三个ajax,需要这个restaurant_id
    res.render('restaurant', {
        restaurant_id:_id,
        title: "Restaurant Detail"
    });
});


// router.post('/test1', function (req, res, next) {
//     //从req.body拿到前面ajax传递的data (那个JSONData)， 注意这里其实是字符串，不是JSON！
//     var formData = req.body;
//     //假装这里是处理业务逻辑(例如mongodb操作)，这里把req.body里的参数拿出来给其他业务做参数，
//     // 比如req.body.firstName,或者取rrq.body.estaurant_id, req.body.username之类的。
//
//     console.log(formData.firstName)
//     console.log(formData);
//     //JSON.stringify(formData)!
//     //如果是我写的后台monk-mongodb操作返回的docs不需要，monk似乎直接处理成json了，
//     // 毕竟Mongodb里就是BSON和它类似，字符串伪json比如{'a':'haha','b':'heihei'}之类的
//     // 必须JSON.stringify()转换后用res.json()输出给前台
//     //假装是mongodb的结果，比如docs
//     var fakeJSON = {"a": "hahaha", "b": "xixixi"};
//     res.json(JSON.stringify(fakeJSON));
// });
// router.get('/test2', function (req, res, next) {
//     var formData = req.query;
//     //req.query就是获取的参数对象，此时formData为对象
//
//     console.log(formData.firstName)//对象.firstName
//     console.log(formData);
//     //要有一步传参数到数据库的操作
//     //blablablabla操作
//
//     //假装是mongodb返回过来的结果，比如docs
//     var fakeJSON = {"a": "hahaha", "b": "xixixi"};
//     res.json(JSON.stringify(fakeJSON));
//     //序列化后返回前台
// });


module.exports = router;
