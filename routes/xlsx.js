var express = require('express');
var path = require('path');
var router = express.Router();

var xlsx = require('node-xlsx');
var fs = require('fs');
var request = require('request');


router.get('/', function (req, res) {
    res.render('xlsx')
})

/**
 * 导出文件
 */
router.get('/export', function (req, res, next) {
    const data = [
        [1, 2, 3],
        [true, false, null, 'sheetjs'],
        ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
        ['baz', null, 'qux']
    ];

    var buffer = xlsx.build([{
        name: "mySheetName",
        data: data
    }]);

    var filePath = path.join(__dirname, '..', 'public/xlsx/test.xlsx');
    fs.writeFileSync(filePath, buffer, 'binary', function (err, fd) {
        if (err) {
            throw err;
        }
        console.log('write success.');
    });
    res.send('export successfully!');
});


module.exports = router;