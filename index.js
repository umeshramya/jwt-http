var exports = module.exports = {};//export set up
/* 
=================================================================
            REQUIRED MODULES
=================================================================
*/ 
const http = require("http");//http require
const https = require("https");

var util = require('util');
var queryString = require("querystring");//querystring require
var fs = require("fs");
var path = require("path");
var render = require("render-html-async");
var moment = require("moment"); //for manging date 

/*
    ====================================
    Modules requried with re exports
    ====================================
*/
var httpMsgs = require("http-msgs");//httpMsgs require for local purpose
module.exports.httpMsgs = httpMsgs;

var JWT = require("jwt-login");// login module

// var roles = require("./src/users/users");//user-groups-roles
// module.exports.roles = roles;

var httpjs = require("./src/http/http");//thss module for http
var reqMet = require("./src/http/reqMethod")// this is for getMethod and postMethod
module.exports.roles = require("user-groups-roles");

/*
=================================================================
                MODULE WIDE VARIABLES
=================================================================
*/ 

var currentURL = "";//this stores the last url accesed;
var getOBJ=[]; // this strores all get routes declred by consumer app
var postOBJ=[];// this strors all post routes declred by consumer app
var putOBJ = []// this strors all put routes declred by consumer app
var deleteOBJ=[]// this strors all delete routes declred by consumer app
var middleWere = [];// this array of app.use middlewere
/*
====================================================================
                    404, 403 and 500  error routes
 ===================================================================
 

*/ 
var HtmlErrors = {
    html404    : "",
    html403    : "",
    html405     : "",
    html413    : "",
    html500    : ""
};

var setHTMLErrors = function(htmlFilePath, htmlNum){
    fs.readFile(htmlFilePath, null, function(err, data){
        if(err){
            HtmlErrors["html" + htmlNum ]= "<h1> Server says, Error Number " + htmlNum + "</h1>"
        }else{
            HtmlErrors["html" + htmlNum ]= data;
 
        }
    });
}

var setHTML404 = function(htmlFilePath){
    // set routes the routes for 404 page
    setHTMLErrors(htmlFilePath, 404);
}
module.exports.setHTML404 = setHTML404;


/*
=======================================
             HTTP Server
=======================================
*/ 

module.exports.setUpLoadFolder = httpjs.setUpLoadFolder;// this sets the upload folder 



var httpServer = http.createServer(function(req,res){
    req.protocol = "http";
    try {
        router(req, res);
    } catch (error) {
        // checks the route for 500 error is declered it temaporarly
        // rediret to that page else sends json
        httpMsgs.send500(req, res, "Bad HTTP request "+ error.message, HtmlErrors.html500);
    }

});
// https server


var setHttpsServer = function(options, port){
// options means value of key and cert i.e
    https.createServer(options, function(req, res){
        req.protocol = "https";
        try {
            router(req, res);
        } catch (error) {
            // checks the route for 500 error is declered it temaporarly
            // rediret to that page else sends json
            httpMsgs.send500(req, res, "Bad HTTP request "+ error.message, HtmlErrors.html500);
        }
    }).listen(port,"", function(){
        console.log ("https server is listing at port " + port);//console message for sending port number  
    });
}

module.exports.setHttpsServer = setHttpsServer;


module.exports.setPort  =  function(port){
    // this set port and also listen
    httpServer.listen(port);
    console.log ("http server is listing at port " + port);//console message for sending port number  
  
}


var router = function(req, res){
    //this presets the "/" to "/index"
    if(req.url === "/"){
        req.url = "/index"
    }

    currentURL = req.url;// setting current url
 
    if(req.method== "GET"){
        httpjs.httpRequest(req,res, currentURL,getOBJ, httpMsgs, HtmlErrors);
    }else if(req.method=="POST"){
        httpjs.httpRequest(req,res, currentURL,postOBJ, httpMsgs, HtmlErrors)
    }else if(req.method=="PUT"){
        httpjs.httpRequest(req,res, currentURL,putOBJ, httpMsgs, HtmlErrors)
    }else if(req.method=="DELETE"){
        httpjs.httpRequest(req,res, currentURL, deleteOBJ, httpMsgs, HtmlErrors)
    }else{
        // unsapported method
        if(HtmlErrors.html413 == ""){
            httpMsgs.send405(req,res, HtmlErrors);

        }else{
            httpMsgs.send413(req, res, HtmlErrors.html413);
        }
    }
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

   return "\\?(((\\w|\\%|\\$|\\+|\\@|\\.|\\,|\\:|\\;)+\\=(\\w|\\%|\\$|\\+|\\@|\\.|\\,|\\:|\\;)+)+|\\&)+";
    
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
         GET POST PUT DELETE
===========================================
*/ 

var getMethod = function (url,  UseMiddleWere = true, ...callbacks){
    /*
        this adds array of getOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    reqMet.reqMethod(url,UseMiddleWere,getOBJ,middleWere, ...callbacks);
}

module.exports.getMethod= getMethod;

var postMethod = function(url,  UseMiddleWere = true ,...callbacks){
    /*
        this adds array of postOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    reqMet.reqMethod(url,UseMiddleWere,postOBJ,middleWere, ...callbacks);
}

module.exports.postMethod = postMethod;

var putMethod = function(url,  UseMiddleWere = true ,...callbacks){
    /*
        this adds array of putOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    reqMet.reqMethod(url,UseMiddleWere, putOBJ,middleWere, ...callbacks);
}

module.exports.putMethod = putMethod;

var deleteMethod = function(url,  UseMiddleWere = true ,...callbacks){
    /*
        this adds array of deleteOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    reqMet.reqMethod(url,UseMiddleWere, deleteOBJ, middleWere, ...callbacks);
}
module.exports.deleteMethod = deleteMethod;


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
var setlogout = function(){
    getMethod("/logout", false, function(req, res, previous){
        httpMsgs.setCookie(req, res,"JWTtoken=''", "Yor are loged out", true);
    });
  
}
module.exports.setlogout = setlogout;


var setLoginRoute = function(loginMiddlewereMethod, secret, expireInMinutes=0){
    //login post route
    postMethod("/login", false, loginMiddlewereMethod, function(req, res, previous){
        var data =  queryString.parse(req.body)// access the posted data
        // checks for user prperty in req.body
        if (!util.isNullOrUndefined(data.user))
        var user = data.user;//sets to user var
        else{
            httpMsgs.send500(req, res, "user argment not set", true);// sends 500 if not set
            return false;// end further running
        }
       
        var curDate = moment();// gets the present time and date from moment node_module
        
        var payload = {"user" : user, "createdDate" : curDate, "expireInMinutes" : expireInMinutes};// creates the payload for JWT
        JWT.setSecretKey(secret);// setting secret key
        JWT.createJWT(payload);//create JWT  with payload
        
        if (req.protocol === "https"){
            // req.protocol is custom property for setting https versus http
            var secure = true
        }else if(req.protocol === "http"){
            var secure = false
        }
        var token = httpMsgs.setCookieString(req, res, "JWTtoken",  JWT.createJWT(payload),'', 86400,true, secure ); 
        httpMsgs.setCookie(req, res,token, "Login Successful",true);//res.end() is triggerd by setcooke method       
        
    });
}

exports.setLoginRoute = setLoginRoute;


// validate_login middle ware
var validate_login = function(req, res, previous){
    // this method varifies the JWT and expire time
    
    var JWTtoken = httpMsgs.getCookie(req, res, "JWTtoken");// gets the cookie JWTtoken
    if(JWTtoken == ""){// not allowed if JWTtoken is undefined
        //write code for forbidden 
        httpMsgs.send500(req, res, "Not allowed access this content");
        return false// terminates the routes also
    }else{
        var JWTtoken = httpMsgs.getCookie(req, res, "JWTtoken");// gets the cookie JWTtoken
        var validJWT = JWT.validateJWT(JWTtoken);// check the authenticity of JET token
        if (validJWT == false){// not allowed if invalid
            //write code for forbidden
            httpMsgs.send500(req, res, "Not allowed access this content");
            return false// terminate route
        }else{// valid JWT token then
            var createdDate = JSON.parse(validJWT).createdDate;// access carted time
            var expireInMinutes = JSON.parse(validJWT).expireInMinutes; //  access expires durration in minutes

            var ftime = moment(createdDate);// created time
            var nowTime = moment();// now time 
            var gapTime = moment(nowTime).diff(ftime, "minutes");// gaptime to compare event from created time

            if ((gapTime > expireInMinutes) && (expireInMinutes > 0 )){
                // if time si more or if expireInMinutes is set more than zero "zero and less means infinate expire time"
                return false;
            }
            req.jwt = validJWT;// passe it route with user name careted time and expire
        }
    }
}    
exports.validate_login = validate_login; 

/*
    ====================================
    Create Route for assets recusrsively
    ====================================
*/ 
var assetDirpath = "";//this varible stores the assets Dir Path
var setAssetDirRoutes= function(dir){
    // dir is complte path sets using __diranme + "/dir"
    //this function initiates the assets Routes 
    assetDirpath = dir; //sets the module wide 
    setAssets(dir);// call the recusrsive method to crwal down the directory tree
}

module.exports.setAssetDirRoutes = setAssetDirRoutes;

var setAssets = function(dir){
    //this is recusrsive method for drilling the file name
    var fileNameArray = [];//array for storing filenames with path
    var fileRouteArry = [];// array for stoirng routes 
    var fileNameSubStr = '';// this var stores the remaining file path by choping assetDirpath length

    var files = fs.readdirSync(dir)//call the fs module to enlist files/ folder in specified directory
   
    for (let index = 0; index < files.length; index++) {// for loop 
        var next = path.join(dir , files[index]);//asign file/folder to next variable

        if(fs.lstatSync(next).isDirectory()){//check for file or directory
            
            setAssets(next);//if directory call the recurssively

        }else{// push to array
            fileNameSubStr =  next.substr(assetDirpath.length, next.length);

            //replace all forword slashes "/ " by backward for pupose of routes
            // push to array route and file name array
            fileRouteArry.push(fileNameSubStr.replace(/\\/g, "/"));
            fileNameArray.push(next);
        }
    }
    // call send file method to generate get method routes from loop
    for (let i = 0; i < fileNameArray.length; i++) {
        sendFile(fileRouteArry[i], "", fileNameArray[i]);
    }
   
}


/*
    =========================
        user groups and roles
    =========================
*/ 




