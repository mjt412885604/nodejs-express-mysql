var express = require('express');
var router = express.Router();

var db = require("../config/db");

/* GET home page. */
router.get("/", function (req, res) {
  if (req.cookies.user) { //cookie中存在用户信息，则直接返回登陆页面
    res.render("perCenter", {
      u_tel: req.cookies.user.user
    })
  } else {
    res.redirect("index");
  }
});

/**
 * 首页
 */
router.get('/index', function (req, res) {
  res.render("index", {
    title: 'express-mysql-login'
  });
})

/**
 * 登录页面
 */
router.get('/login', function (req, res) {
  res.render('login')
})

/**
 * 登录操作->mysql查询
 */
router.post('/login.do', function (req, res) {
  console.log(req.body.phone);
  console.log(req.body.pwd);
  db.query("select * from admin_user where u_phone='" + req.body.phone + "' and u_password='" + req.body.pwd + "'", function (err, data) {
    if (data.length > 0) {
      res.cookie("user", {
        "user": req.body.phone,
        "pwd": req.body.pwd
      }, {
        maxAge: 1000 * 60 * 30
      }); //登陆成功后将用户和密码写入Cookie，maxAge为cookie过期时间
      req.session.user = req.body.phone; //服务器端session保存登陆的会话状态
      res.render("perCenter", {
        u_tel: req.session.user
      });　　　　　　　　　　　　　　　　　　　　　
    } else {
      res.send('<p style="color:red;">用户或密码错误</p>')
    }
  })
})

/**
 * 退出登录
 */
router.get('/login.out', function (req, res) {
  if (req.cookies.user) {
    res.clearCookie('user')
  }
  res.redirect('index')
})

/**
 * 注册页面
 */
router.get('/register', function (req, res) {
  res.render('register')
})

/**
 * 注册操作->mysql写入数据
 */
router.post('/register', function (req, res) {
  db.query("select * from admin_user where u_phone='" + req.body.phone + "'", function (err, data) {
    if (data.length > 0) {
      res.send("该账号已经注册！");
    } else {
      db.query("insert into admin_user(u_phone, u_password) values('" + req.body.phone + "', '" + req.body.pwd + "')", function (err, data) {
        if (data) {
          res.send("注册成功！");
        } else {
          res.render('error', {
            messgae: err || '用户或密码错误'
          })
        }
      })
    }
  })
})

/**
 * 修改密码页面
 */
router.get('/modify', function (req, res) {
  res.render('modify')
})

/**
 * 修改密码->mysql更新数据
 */
router.post('/modify', function (req, res) {
  db.query("select * from admin_user where u_phone='" + req.body.phone + "' and u_password='" + req.body.pwd + "'", function (err, data) {
    if (data.length > 0) {
      if (req.body.reset_pwd) {
        db.query("update admin_user set u_password='" + req.body.reset_pwd + "' where u_phone='" + req.body.phone + "'", function (err, data) {
          if (data) {
            res.send("修改成功！");
          } else {
            res.send("修改密码失败！");
          }
        })
      } else {
        res.send("请输入新密码！");
      }
    } else {
      res.send("老密码不正确！");
    }
  })
})


module.exports = router;