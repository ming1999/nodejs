var express = require('express');
var app = express();
// 控制器
var router = require('./controller/router.js');

// 设置模版引擎
app.set('view engine', 'ejs');
// 设置静态目录
app.use(express.static('./public'));
app.use(express.static('./uploads'));

// 首页
app.get('/', router.showIndex);
// 相册
app.get('/:picsName', router.showPics);
// 上传页面
app.get('/up', router.showUp);
// 处理上传
app.post('/up', router.doUp);


// 404 页面
app.use(function (req,res,next){
    // res.send('404 NOT FOUND');
    res.render('err');
});


app.listen(3000);


