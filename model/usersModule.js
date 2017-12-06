module.exports = (function () {
    var fs = require('fs');
    
    var users = {
        'moshe': {
            password: '123',
            email: 'moshe@moshe.com'
        }
    }

    function checkLogIn(username, password) {
        if (users[username]) {
            if (users[username].password == password) {
                return true;
            }
        }        
        else {
            return false;
        }
    }

    function registerUser(newUserName, newPassword, newEmail) {
        if (users[newUserName]) {
            return false;
        } 
        else {
            users[newUserName] = {
                password: newPassword,
                email: newEmail
            }
            return true;
        }        
    }


    return {
        checkLogIn: checkLogIn,
        registerUser: registerUser
    }
    
})();