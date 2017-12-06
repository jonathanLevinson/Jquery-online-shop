var express = require('express');
var router = express.Router();
var cart = require('../model/cart');
var products = require('../model/products');
var session = require('express-session');
var saveId;

router.use(function(req, res, next) {
    if (session.isLoggedIn) {
        saveId = session.userName;
    }
    else {
        saveId = req.session.id;
    }
    next();
})

router.get('/init', function(req, res, next) {
    cart.init(saveId, function(numberOfItemsInCart) {
        res.send({num: numberOfItemsInCart});
    });
});

router.get('/add/:cat/:subCat/:name/:quantity', function(req, res, next) {       
    var currentProduct = products.getProduct(req.params.cat, req.params.subCat, req.params.name);
    currentProduct["quantity"] = req.params.quantity;
    var numberOfItemsInCart = cart.addToCart(currentProduct, saveId);
    res.send({num: numberOfItemsInCart});
});

router.get('/get', function(req, res, next) {
    var cartData = cart.sendCartData(saveId);
    res.json({cartContents: cartData});
});

router.get('/remove/:index', function(req, res, next) {
    var numberOfItemsInCart = cart.removeFromCart(saveId, req.params.index);
    var cartData = cart.sendCartData(saveId);
    res.send({num: numberOfItemsInCart, cartContents: cartData});
});

router.get('/:index/:qty', function(req, res, next) {
    cart.updateQuantity(saveId, req.params.index, req.params.qty);
    res.send({status: "ok"})
})

router.get('/reset', function(req, res, next) {
    var numberOfItemsInCart = cart.resetCart(saveId);
    res.send({num: numberOfItemsInCart});
})

router.get('/login', function(req, res, next) {
    cart.reSaveCartWithUserNameOnLogin(session.userName, req.session.id);
    res.sendStatus(200);
})

module.exports = router;