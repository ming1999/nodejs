var file = require('../models/file.js');
var fs = require('fs');
var formidable = require('formidable');
var datetime = require('silly-datetime');
var path = require('path');


// 首页控制器
exports.showIndex = function (req, res, next) {
    // res.send('我是首页');
    // res.render('index.ejs', {
    //     // 数组数据是文件夹名,将来回读取实际数据
    //     pics : file.getPics()
    // });
    // 主动调用: 当执行完getPics的读文件夹操作之后,才执行回调部分的代码
    file.getPics(function (err, allPics) {
        if (err) {
            next(); //未读到文件夹,则将请求交给后续程序处理
            return;
        }
        // 绑定数据,并渲染页面
        res.render(
            'index',
            {pics: allPics}
        );
    });
};

// 相册控制器
exports.showPics = function (req, res, next) {
    // res.send('读取:[ ' + req.params.picsName + ' ]相册');
    // res.render('images', {
    //     picsName : req.params.picsName,
    //     imgs : ['0.jpg', '1.jpg', '2.jpg']
    // });
    var picsName = req.params.picsName;
    // 主动调用: 当执行完getImages的读文件夹操作之后,才执行回调部分的代码
    file.getImages(picsName, function (err, imagesArray) {
        if (err) {
            next(); //未读到文件夹,则将请求交给后续程序处理
            return;
        }
        // 绑定数据,并渲染页面
        res.render(
            'images',
            {
                picsName: picsName,
                imgs: imagesArray
            }
        );
    });
};


// 上传页面的控制器
exports.showUp = function (req, res) {
    // res.render('up');
    file.getPics(function (err, allPics) {
        // 绑定数据,并渲染页面
        res.render(
            'up',
            {pics: allPics}
        );
    });
};

// 处理上传
exports.doUp = function (req, res, next) {
    // 使用第三方模块,来处理文件上传
    var form = new formidable.IncomingForm();
    form.uploadDir = './uploads';

    form.parse(req, function (err, fields, files, next) {
        // console.log(fields, files);
        if (err) {
            next(); // 数据有问题.跳出此业务
            return;
        }
        // 判断文件大小,不接受过大的文件 10M
        var size = files.myfile.size;
        if (size > 10485760) {
            res.send('文件尺寸过大,请上传小于10M的图片');
            // 删除文件
            fs.unlink(files.myfile.path);
            return;
        }

        // 限制文件类型
        var imageType = 'jpg|jpeg|png|gif|bmp';
        var fileType = path.extname(files.myfile.name).substr(1);
        if (imageType.indexOf(fileType) == -1) {
            res.send('请上传有效的图片文件');
            // 删除文件
            fs.unlink(files.myfile.path);
            return;
        }

        var t = datetime.format(new Date(), 'YYYYMMDDHHmmss');
        var ran = parseInt(Math.random() * 10000);
        var extname = path.extname(files.myfile.name);
        var wjj = fields.wjj;
        // 旧文件
        var oldpath = files.myfile.path;
        // 新文件
        var newpath = './uploads/' + wjj + '/' + t + ran + extname;
        console.log(newpath);

        // 执行改名
        fs.rename(oldpath, newpath, function (){
            if (err) {
                res.send('改名失败');
                return;
            }
            res.redirect('/' + wjj);
        });

    });

};



