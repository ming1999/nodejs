var fs = require('fs');

// 用于读取出所有的相册文件夹
exports.getPics = function (callback) {
    // // 假设读到的数据是:
    // return ['静静', '艳艳', '沙沙', 'Seeker'];
    // 读取并判断文件夹
    fs.readdir('./uploads', function (err, files) {
        if (err) {
            callback('找不到文件夹', null);
            return;
        }

        var allPics = [];
        // 迭代器
        (function iterator(i) {
            if (i == files.length) {
                // 遍历结束
                console.log(allPics);
                // return allPics;
                callback(null, allPics);
                return;
            }
            fs.stat('./uploads/' + files[i], function (err, stats) {
                if (err) {
                    callback('找不到文件', null);
                    return;
                }
                if (stats.isDirectory()) {
                    allPics.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
};


// 用于读取出所有的图片
exports.getImages = function (picsName, callback) {
    // 读取并判断文件夹
    fs.readdir('./uploads/' + picsName, function (err, files) {
        if (err) {
            callback('没有找到文件', null);
            return;
        }

        var allImages = []; // 存储所有的图片
        // 迭代器
        (function iterator(i) {
            if (i == files.length) {
                // 遍历结束
                console.log(allImages);
                // return allImages;
                callback(null, allImages);
                return;
            }
            fs.stat('./uploads/' + picsName + '/' + files[i], function (err, stats) {
                if (err) {
                    callback('找不到文件', null);
                    return;
                }
                if (stats.isFile()) {
                    allImages.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
};


