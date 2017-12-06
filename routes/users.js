var express = require('express');
var router = express.Router();
var usersModule = require('../model/usersModule');
var session = require('express-session');

router.post('/status', function(req, res, next) {  
    res.send({userName:session.userName, status: session.isLoggedIn});  
})

router.post('/logIn', function(req, res, next) {
  session.isLoggedIn = usersModule.checkLogIn(req.body.userName, req.body.password);
  
  if (session.isLoggedIn) {
    session.userName = req.body.userName;
    res.send({userName: session.userName, status: session.isLoggedIn});
  }
  else {
    res.send({status: false});
  }  
});

router.post('/logOut', function(req, res, next) {
  session.isLoggedIn = false;
  session.userName = '';
  res.send({status: session.isLoggedIn})
});

router.post('/register', function(req, res, next) {
  var registrationStatus = usersModule.registerUser(req.body.userName, req.body.password, req.body.email);
  res.send({status: registrationStatus});
});

module.exports = router;
