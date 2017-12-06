var express = require('express');
var router = express.Router();
var products = require('../model/products');
var cart = require('../model/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  var categoriesAndSubCategories = products.getCategories();
  var randomProducts = products.getRandomProducts(6);
  res.render('products', {cat: categoriesAndSubCategories, batch: randomProducts});
});

module.exports = router;