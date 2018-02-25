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
var path = require("path");
var render = require("render-html-async");



/*
    ====================================
    Modules requried with re exports
    ====================================
*/
var httpMsgs = require("http-msgs");//httpMsgs require for local purpose
module.exports.httpMsgs = httpMsgs;

var JWT = require("jwt-login");// login module
module.exports.JWT = JWT;

var roles = require("user-groups-roles");//user-groups-roles
module.exports.roles = roles;

var httpjs = require("./src/http/http");//thss module for http
var reqMet = require("./src/http/reqMethod")// this is for getMethod and postMethod


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
        //this presets the "/" to "/index"
        if(req.url === "/"){
            req.url = "/index"
        }

        currentURL = req.url;// setting current url
        // GET method
        if(req.method== "GET"){
            httpjs.httpGet(req,res, currentURL,getOBJ,httpMsgs);

            // POST method
        }else if(req.method=="POST"){
            httpjs.httpPOst(req,res, currentURL,postOBJ,httpMsgs);
            
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
   var regPart = "(\\w|\\;|\\/|\\:|\\@|\\+|\\$|\\%|\\.|\\,)+";
   return "(\\?)((" + regPart +"(\\=)" + regPart +"|\\&)+";
    
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
            // GET RELEVENT METHODS
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


/*
=============================
    POST RELEVENT METHODS
=============================
*/ 
var postMethod = function(url,  UseMiddleWere = true ,...callbacks){
    /*
        this adds array of getOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    
    reqMet.reqMethod(url,UseMiddleWere,postOBJ,middleWere, ...callbacks);

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


var setLoginRoute = function(loginMiddlewereMethod){
    //login post route
    postMethod("/login", false, loginMiddlewereMethod, function(req, res, previous){
        
        var payload = {"user" : queryString.parse(req.body).user, "createdDate" : Date()};
        JWT.setSecretKey("secret");
        JWT.createJWT(payload);
        var token = "JWTtoken="   + JWT.createJWT(payload)
        httpMsgs.setCookie(req, res, "Login Successful",token, true);//res.end() is triggerd by setcooke method       
        
    });
}

exports.setLoginRoute = setLoginRoute;


// validate_login middle were
var validate_login = function(req, res, previous){
    var JWTtoken = httpMsgs.getCookie(req, res, "JWTtoken");
    if(util.isUndefined(JWTtoken)){
        return false
    }else{
        var valid_jwt = JWT.validateJWT(JWTtoken);
        if (valid_jwt == false){
            return false
        }else{
            req.jwt = valid_jwt;
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




