module.exports = (function() {
    var fs = require('fs');
    var allProducts;
    fs.readFile('./data/products.json', function(err, data){
        allProducts = JSON.parse(data);
    })

    function getCategories() {
        var categories = {};
        
        for (var key in allProducts) {
            var subCategories = [];
            var i = 0;
            var currentKey = allProducts[key];
            for (var subKey in currentKey) {
                subCategories[i] = subKey;
                i++;
            }
            categories[key] = subCategories;
        }
        return categories;
    }

    function getRandomProducts(numberOfProducts) {
        var mainKeys = Object.keys(allProducts);
        var res = [];
        res.length = numberOfProducts;
        for (var i = 0; i < numberOfProducts; i++) {
            var mainRandomNum = Math.floor(Math.random() * (mainKeys.length - 1));
            var subKeys = Object.keys(allProducts[mainKeys[mainRandomNum]]);
            var subRandomNum = Math.floor(Math.random() * (subKeys.length - 1));
            var innerLength = allProducts[mainKeys[mainRandomNum]][subKeys[subRandomNum]].length;
            var innerRandomNum = Math.floor(Math.random() * (innerLength - 1));
            res[i] = allProducts[mainKeys[mainRandomNum]][subKeys[subRandomNum]][innerRandomNum]; // TO DO: prevent duplicate products
        }
        return res;
    }

    function getsubCategoryContents(category, subcategory) {
        return allProducts[category][subcategory];
    }

    function getProduct(category, subcategory, name) {
        function findName (product) {
            if (name == product.name) {
                return product
            }
        }
        return allProducts[category][subcategory].find(findName);
    }

    return {
        getCategories: getCategories,
        getRandomProducts: getRandomProducts,
        getsubCategoryContents: getsubCategoryContents,
        getProduct: getProduct
    }
})();