var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('upload', {title: 'Sheffield Food Guide'});
});

module.exports = router;