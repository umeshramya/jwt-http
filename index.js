var exports = module.exports = {};//export set up
/* 
=================================================================
            REQUIRED MODULES
=================================================================
*/ 
var Http = require("http");//http require
var util = require('util');
var queryString = require("querystring");//querystring require
var fs = require("fs");
var render = require("render-html-async");


/*
    ====================================
    Modules requried with re exports
    ====================================
*/
var httpMsgs = require("./src/http/httpMsgs");//httpMsgs require for local purpose
module.exports.HTTPMsgs = httpMsgs;

var httpFiles = require("./src/http/httpFiles"); //this is for files sending like html css and javascript for front end development
module.exports.HTTPFiles = httpFiles;

var cookie = require("./src/http/cookie/cookie");//this module contains cookie releted functions
module.exports.cookie = cookie;

var JWT = require("jwt-login");// login module
module.exports.JWT = JWT;

var roles = require("user-groups-roles");//user-groups-roles
module.exports.ROLES = roles;


/*
=================================================================
                MODULE WIDE VARIABLES
=================================================================
*/ 

var currentURL = "";//this stores the last url accesed;
var getOBJ=[]; // this strores all get routes declred by consumer app
var postOBJ=[];// this strors all post routes declred by consumer app
var middleWere = [];// this array of app.use middlewere

/*
=======================================
             HTTP Server
=======================================
*/ 

var server = Http.createServer(function(req,res){
    try {  
        currentURL = req.url;// setting current url
        //foundURL is by false if requested URL gets matched then it is set true
        // useful for 404 status
        var foundURL = false;// this variable stores the
        var previous = true // this variable is for checking weather to call next method in (Middle were)
        
        // GET method
        if(req.method== "GET"){
            var curGetOBJ;//this stores cur array inside array of getOBJ 
            for (let index = 0; index < getOBJ.length; index++) {
                curGetOBJ = new RegExp (getOBJ[index][0]);//this is url from the array
                if(curGetOBJ.test(currentURL)){
                        foundURL= true;// set the found var to true as url is found
                    for (let i = 1; i < getOBJ[index].length; i++) {
                        previous = getOBJ[index][i](req, res, previous);
                        if(previous == false){
                            res.end();//end the responce in case of breaking the loop
                            break;
                        }
                    }
                }

                if (foundURL == true){//if true
                    break; // break loop as url is found
                }
                
            }

            if(foundURL == false){//if false
                // send 404 message if requested url did not match
                httpMsgs.send404(req,res);
            }

            // POST method
        }else if(req.method=="POST"){
            var curPostOBJ;// current postOBJ array inside array of postOBJ
            var reqBody ='';//this us reqbody sent
            var reqBodySize = true;//this var for checking the req body size 
            for (let index = 0; index < postOBJ.length; index++) {
                curPostOBJ = new RegExp(postOBJ[index][0]);
                if(curPostOBJ.test(currentURL)){
                    foundURL = true;// set this true if url is detected                
                    req.on('data', function(data){
                        reqBody  += data
                        if(reqBody.length > 1e7){//limiting size of data to less than 10mb
                            httpMsgs.send413(req,res);
                            reqBodySize = false;
                        }
                    });//end req,on('data', function(data))

                    req.on("end", function(){
                        if (reqBodySize){
                            for (let i = 1; i < postOBJ[index].length; i++) {
                                req.body = reqBody
                                previous = postOBJ[index][i](req, res, previous);
            
                            if(previous == false){
                                res.end();//end the responce in case of breaking the loop
                                break;
                            }
                        }
                        
                            
                        }//end of if (reqBodySize)
                        
                    })//end of req.on("end", function()
                    
                } //end of if(curPostOBJ.test(currentURL))
                if(foundURL == true){
                    break;//break further excuation of loop 
                }     
            }//end of for (let index = 0; index < postOBJ.length; index++)

            if (foundURL == false){
                // send 404 message if requested url did not match
                httpMsgs.send404(req,res);
            }

        }else{
            // unsaported method
            httpMsgs.send405(req,res);

        }

    } catch (error) {
        httpMsgs.send500(req, res, "Bad HTTP request "  + error.message);
            
    }

});

module.exports.setPort  =  function(port){
    // this set port and also listen
    server.listen(port);
    console.log ("server is listing at port " + port);//console message for sending port numbe
}


module.exports.getURL= function(){
    /*
        This returns the url just used i.e current 
    */ 
    return currentURL;
}
module.exports.queryExpression = function(){
    /*
        this need to add to url for allowing adding query string 
        for example "/emp"+ app.queryExpression (in the consumer modules);
    */ 
    return "((\\?|\\&)\\w+\\=\\w+)+"
    
}
var getLastParsedQuery = function (){
    /*
    last parsed query
    Ths returns the parsed query string as JSON object
    */ 
    var curURL = currentURL
    var queryStringIndex = curURL.indexOf("?");
    var qsString = curURL.substr(queryStringIndex + 1, curURL.length);
    return queryString.parse(qsString);
}

module.exports.getParsedQuery = getLastParsedQuery

/*
=========================
    MIDDLEWERE
=========================
*/ 

module.exports.use= function(mWere){
    // ADD GENERAL MIDDLE WERE
    middleWere.push(mWere);
}


/*
===========================================
            GET RELEVENT METHODS
===========================================
*/ 

var getMethod = function (url,  UseMiddleWere = true,...callbacks){
    /*
        this adds array of getOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    // code to prevent entry of duplicate url
    for (let i = 0; i < getOBJ.length; i++) {
        if(getOBJ[i][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    var curGetOBJ=[url];
    if(UseMiddleWere){// ads to routes only if UseMiddlewere boolen set to true
        for (let j = 0; j < middleWere.length; j++) {
            curGetOBJ.push(middleWere[j]);        
        }
    }

    for (let k = 0; k < callbacks.length; k++) {
        curGetOBJ.push(callbacks[k]);
        
    }
    getOBJ.push(curGetOBJ);
}

module.exports.getMethod= getMethod;


/*
=============================
    POST RELEVENT METHODS
=============================
*/ 
var postMethod = function(url,  UseMiddleWere = true ,...callbacks){
    for (let i = 0; i < postOBJ.length; i++) {
        if(postOBJ[i][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    var curPostOBJ=[url];

    if(UseMiddleWere){
        for (let j = 0; j < middleWere.length; j++) {
            curPostOBJ.push(middleWere[j]);        
        }

    }

    for (let k = 0; k < callbacks.length; k++) {
        curPostOBJ.push(callbacks[k]);
        
    }
    postOBJ.push(curPostOBJ);

    }

    module.exports.postMethod = postMethod;


/*
==============================
    Frontend file getmethods
==============================
*/ 


var sendFile = function(url,contentType , path){
    /*
        This is method for serving files to front end . html, javascript, css, jpeg, png etc
        This method uses getmethod bypasses middlewere
        makes asychronous file read from module httpFiles.js
        url :- url to beused to call from front end
        contentType :- type of content html, css, javascript
        path :- actual file folder where the file exist

    */ 

    getMethod(url, false, function(req, res){
        fs.readFile(path, null, function(err, data){
            if(err){
                httpMsgs.send404(req, res);
            }else{
                res.writeHead(200, {"Content-Type" : contentType});
                res.write(data);
                res.end();
            }
    
        });
    });

}

module.exports.sendFile = sendFile;

var renderHTML = function(url, path){
    getMethod(url,false,function(req,res){
        render.renderHTML(path, currentURL).then(function(renderData){
            res.writeHead(200, {"Content-Type" : "text/html"});//write head
            res.write(renderData);//write html string
            res.end();//end res
    
        }).catch(function(message){
            httpMsgs.send404(req, res);
        });

    });

}

module.exports.renderHTML= renderHTML;

/*
==========================
Login
==========================

*/ 
/*
    1. write method by nae loginMethod(user, password) this method does database connection has to be wrtten by consumer of this framwork
    2. call loginMiddleWere as variable not as function;
    3. set route "/."  by this method setLoginRoute();
    
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
var loginMiddleWere =  loginMiddleWere = function(req, res, previous){
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
            httpMsgs.send500(req, res, "Invalid user and password");
            return false;
        }
        
    } catch (error) {
        httpMsgs.send500(req, res, error);
        return false;//prevent excustation next function
    }
}

exports.loginMiddleWere = loginMiddleWere;


var setLoginRoute = function(){
    //login post route
    postMethod("/login", false,  loginMiddleWere, function(req, res, previous){
        var payload = {"user" : previous, "expDate" : Date()};
        JWT.setSecretKey("secret");
        JWT.createJWT(payload);
        var token = "JWTtoken="   + JWT.createJWT(payload)
        cookie.setCookie(req, res, token);
    });
}

exports.setLoginRoute = setLoginRoute;
