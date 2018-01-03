var express = require('express');
var router = express.Router();

var db = require("../config/db");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', function (req, res, next) {
  db.query("select * from admin_user", function (err, rows) {
    if (err) {
      res.render("list", {
        title: "用户列表",
        datas: []
      });
    } else {
      res.render("list", {
        title: "用户列表",
        users: rows,
        cookie: req.cookies
      });
    }
  });
});

module.exports = router;