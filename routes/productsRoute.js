var express = require('express');
var router = express.Router();
var products = require('../model/products');

router.get('/:cat/:subCat', function(req, res, next) {
    var categoriesAndSubCategories = products.getCategories();
    var productsOfSubCategory = products.getsubCategoryContents(req.params.cat, req.params.subCat);
    res.render('products', {cat: categoriesAndSubCategories, batch: productsOfSubCategory});
}); // TO DO: open current category in the menu and highlight current subcategory

router.get('/:cat/:subCat/:name', function(req, res, next) {
    var categoriesAndSubCategories = products.getCategories();
    var requestedProduct = products.getProduct(req.params.cat, req.params.subCat, req.params.name);
    res.render('productPage', {cat: categoriesAndSubCategories, prod: requestedProduct})
})

module.exports = router;