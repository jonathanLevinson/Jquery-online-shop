$(document).ready(function(){
    clientSide.init();
});

var clientSide = {    
    init: function() {
        var local = this;
        $.get('/cart/init', function(data){
            local.updateCartIcon(data.num);
        });
        $.post('/users/status', function(data) {
            local.changeUserButtonText(data.userName, data.status);
        });
        $(document).on('click', 'span.addSignleItem', local.addToCart);
        $(document).on('click', 'span.checkQuantityAndAdd', local.checkAndAddToCart);
        $(document).on('click','#cart', function() {
            $.get('/cart/get', function(data) {                
                local.loadCart(data);
            });
        });
        $(document).on('click', '#logIn', local.logInUser);
        $(document).on('click', '#register', local.registerUser);
        $("#clearCart").on('click', function() {
            $.get('/cart/reset', function(data) {
                local.updateCartIcon(data.num);
                $('tbody').empty();
                local.updateTotalSum();
            })
        });
    },
    addToCart: function(ev) { 
        var local = this;       
        var path = ev.target.id;
        $.get(path, function(data){
            clientSide.updateCartIcon(data.num);
        });
    },
    checkAndAddToCart: function(ev) {
        var local = this;
        var quantity = $('#qty').val();
        var path = ev.target.id + '/' + quantity;
        $.get(path, function(data){
            clientSide.updateCartIcon(data.num);
        });
    },
    updateCartIcon: function(numberOfItemsInCart) {
        if (0 == numberOfItemsInCart) {
            $(".badge").text("");
        }
        else {
            $(".badge").text(numberOfItemsInCart);
        }
    },
    loadCart: function(data) {
        $('tbody').empty();
        var cartData = data.cartContents;
        for(var i = 0; i < cartData.length; i++) {
            this.createAndAppendRowElements(cartData[i],i);
        }
        this.updateTotalSum();
    },
    
    createAndAppendRowElements: function(product, indexInCart) {
        var local = this;
        var newTr = $('<tr>', {'class':"productRow", "id":indexInCart}); 
        var td1RemoveProduct = $('<td>');
        var xSymbol = $('<i>', { 'class': "fa fa-times-circle" });
        xSymbol.attr('aria-hidden', 'true');
        xSymbol.click(function() {
            $.get('/cart/remove/' + $(this).parent().parent().attr('id'), function(data) {
                local.loadCart(data);
                local.updateTotalSum();
                local.updateCartIcon(data.num);
            });
        });
        td1RemoveProduct.append(xSymbol);
        newTr.append(td1RemoveProduct);

        var td2Name = $('<td>', { 'class': 'name', text: product.name});
        newTr.append(td2Name);

        var td3Configuration = $('<td>', {'class':"configuration"});
        newTr.append(td3Configuration);

        var td4Price = $('<td>', { text: product.price, "class": "price" });
        newTr.append(td4Price);

        var td5NumberInput = $('<td>');
        var NumberInput = $('<input>', { 'type': 'number', 'min': '1', 'max': '10', 'value': product.quantity, 'width': '50px', "id": indexInCart })
        NumberInput.on('change',function() {
            local.calcItemTotal($(this).parent().parent());
            var itemIndex = $(this).attr('id');
            var qty = $(this).val();
            $.get('/cart/' + itemIndex + '/' + qty);
        });
        td5NumberInput.append(NumberInput);
        newTr.append(td5NumberInput);

        var td6Total = $('<td>', { text: '0', 'class': 'productTotal' });
        newTr.append(td6Total);
        $('tbody').append(newTr);
        local.calcItemTotal(newTr);
    },
    calcItemTotal: function(tr) {
        var num1 = parseFloat(tr.children('td').children('input').val(), 10);
        var num2 = parseFloat(tr.children('.price').text(), 10);
        mul = parseFloat(num1 * num2).toFixed(2);
        tr.children('.productTotal').text(mul);
        this.updateTotalSum();
    },
    updateTotalSum: function() {
        var sum = 0;
        $('td.productTotal').each(function() {
            sum += parseFloat($(this).text(), 10);
        })
        sum = parseFloat(sum).toFixed(2);
        $('td.totalSum').html(sum);        
    },
    //empty modal after closing
    logInUser: function (ev) {
        var local = this;
        ev.preventDefault();
        $('#logInMsg').text("");
        var logInData = {
            userName: $('#logInForm #userName').val(),
            password: $('#logInForm #password').val()
        }        
        $.post('/users/logIn', logInData, function(data) {
            if (data.status) {
                $('#userModal').modal('hide');
                clientSide.changeUserButtonText(data.userName, true);
                $.get('/cart/login');
                clientSide.updateCartIcon(0);
            }
            else {
                $('#logInMsg').text("Wrong details, try again");
            }
            
        });
    },
    registerUser: function (ev) {
        ev.preventDefault();
        $('#registerMsg').text("");
        var registerData = {
            userName: $('#registerForm #userName').val(),
            password: $('#registerForm #password').val(),
            email: $('#registerForm #email').val()
        }
        $.post('/users/register', registerData, function(data) {
            if (data.status) {
                $('#userModal').modal('hide');
            }
            else {
                $('#registerMsg').text('User name already exists');
            }
            
        });
    },
    changeUserButtonText: function(userName, status) {
        if (status) {
            $('#userButton').text('Hello ' + userName);
            $('#signOut').text('Sign out');
            $("#user").attr("data-target", "");
            $("#user").on('click', function() {
                $.post('/users/logOut', function(data) {
                    clientSide.changeUserButtonText("", data.status);
                });
            })
        }
        else {
            $('#userButton').text('Log in \ Register');
            $('#signOut').text('');
            $("#user").attr("data-target", "#userModal"); 
            $("#user").off('click', function() {
                $.post('/users/logOut', function(data) {
                    clientSide.changeUserButtonText("", data.status);
                });
            })         
        }        
    }
}