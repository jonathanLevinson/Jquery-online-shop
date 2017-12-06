module.exports = (function(){
    var fs = require('fs');
    var cartData;
    var test = JSON.stringify({prop1:100});

    function init(saveId, responseFunction) {        
        fs.readFile('./data/cart.json', 'utf8', function(err, data){
            if (err) {
                fs.writeFile('./data/cart.json','', function(err, data) {
                    if (err) {
                        throw new Error("Write file unsuccessful");
                    }
                });
            }
            else {
                if ('string' == typeof(data)) {
                    cartData = JSON.parse(data);
                    if(!cartData) {
                        cartData = {};
                    }
                }
                else {
                    cartData = {};
                }
                //console.log(cartData);
            }
            if (!cartData[saveId]) {
                cartData[saveId] = [];
            }
            responseFunction(cartData[saveId].length);
        });
    }    

    function addToCart(product, saveId) {
        var indexOfProduct = indexOfProductInCart(product, saveId); 
        var currentCart = cartData[saveId];     
        if(-1 == indexOfProduct) {
            //product.quantity = 1;
            currentCart.push(product);
        }
        else {
            currentCart[indexOfProduct].quantity = 1 + parseInt(currentCart[indexOfProduct].quantity);
        }
        //console.log(cartData);
        fs.writeFile('./data/cart.json', JSON.stringify(cartData) , function(err, data) {
                    if (err) {
                        throw new Error("Write file unsuccessful");
                    }
                });
        return currentCart.length;
    }

    function indexOfProductInCart(product, saveId){
        var currentCart = cartData[saveId];
        for (var i = 0; i < currentCart.length; i++) {
            if (currentCart[i].name == product.name) {
                return i;
            }
        }
        return -1;
    }

    function removeFromCart(saveId, index) {        
        cartData[saveId].splice(index, 1);
        fs.writeFile('./data/cart.json', JSON.stringify(cartData) , function(err, data) {
                    if (err) {
                        throw new Error("Write file unsuccessful");
                    }
                });
        return cartData[saveId].length;
    }

    function sendCartData(saveId) {
        return cartData[saveId];
    }

    function updateQuantity(saveId, productIndex, newQuantity) {
        cartData[saveId][productIndex].quantity = newQuantity;
        fs.writeFile('./data/cart.json', JSON.stringify(cartData) , function(err, data) {
                    if (err) {
                        throw new Error("Write file unsuccessful");
                    }
                });
    }
    function resetCart(saveId) {
        cartData[saveId] = [];
        fs.writeFile('./data/cart.json', JSON.stringify(cartData) , function(err, data) {
                    if (err) {
                        throw new Error("Write file unsuccessful");
                    }                    
                });
        return cartData[saveId].length;
    }
    function reSaveCartWithUserNameOnLogin(userName, sessionId) {
        cartData[userName] = cartData[sessionId];
        cartData[sessionId] = [];
    }

    return {
        init: init,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        sendCartData: sendCartData,
        updateQuantity: updateQuantity,
        resetCart: resetCart,
        reSaveCartWithUserNameOnLogin: reSaveCartWithUserNameOnLogin
    }

})();