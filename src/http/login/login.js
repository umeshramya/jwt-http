/*
this deals with login  and validatation using module

usage of this module
1. write loginMethod(user, password) this method does database connection has to be wrtten by consumer of this framwork
2. call setLogin(loginMethod) jsut as argument varibale
3. set route "/."  by this method setLoginRoute();


*/ 

var loginMiddleWere;
var setLogin  = function(loginMethod){
    /*
        this method sets the login 
        uses the modules jwt-login
        sets the post route "/login"
        accepts login function or method as arguments. Loginmethod should accept two arguments user and password
        below is example loginMethod
        var loginMethod = fucntion(user, password){
            code for loginMethod goes here
            if there a succussful login it should return true if not false
        }
    */
     loginMiddleWere = function(req, res, previous){
        try {
            var data = queryString.parse(req.body);  
            var user = data.user;
            var password = data.password;
            var loginStatus = false;
            if(util.isString(user) && util.isString(password)){            
                /*
                    ====================
                    //process code check from the database
                    ====================
                */ 
                loginStatus = loginMethod(user, password);


            }else{
                throw new Error("invalid form of posting")
            }
            //loginstatus code
            if (loginStatus){
                return user//return the user to be consumed by payload 
            }else{
                app.HTTPMsgs.send500(req, res, "Invalid user and password");
                return false;
            }
            
        } catch (error) {
            // app.HTTPMsgs.send500(req, res, error);
            app.HTTPMsgs.redirectTemporary(req,res,"/index?name=umesh&age=34");

            return false;//prevent excustation next function
        }
    }

}


var setLoginRoute = function(){
    //login post route
    app.postMethod("/login", false, loginMiddleWere, function(req, res, previous){
        var payload = {"user" : previous, "expDate" : Date()};
        app.JWT.setSecretKey("secret");
        app.JWT.createJWT(payload);
        var token = "JWTtoken="   + app.JWT.createJWT(payload)
        app.cookie.setCookie(req, res, token);
    });
}

