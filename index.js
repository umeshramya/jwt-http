var exports = module.exports = {};//export set up
/* 
=================================================================
            REQUIRED MODULES
=================================================================
*/ 
var Http = require("http");//http require
var util = require('util');
var queryString = require("querystring");//querystring require

// module.exports.httpMsgs = require("./src/http/httpMsgs");//httpMsgs require for sending  responce for export pupose
var httpMsgs = require("./src/http/httpMsgs");//httpMsgs require for local purpose
module.exports.HTTPMsgs = httpMsgs;


var jwt = require("./src/jwt/jwt");
module.exports.JWT = jwt;


var roles = require("user-groups-roles");
module.exports.ROLES = roles;


/*
=================================================================
                MODULE WIDE VARIABLES
=================================================================
*/ 
var currentURL = "";//this stores the last url accesed;
var getOBJ=[]; // this strores all get routes declred by consumer app
var postOBJ=[];// this strors all post routes declred by consumer app

/*
=======================================
             HTTP Server
=======================================
*/ 

var server = Http.createServer(function(req,res){
    currentURL = req.url;// setting current url
    //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = true // this variable is for checking weather to call next method in (Middle were)
    
    // GET method
    if(req.method== "GET"){
        var curGetOBJ;
        
        for (let index = 0; index < getOBJ.length; index++) {
            curGetOBJ = new RegExp (getOBJ[index][0]);
            if(curGetOBJ.test(currentURL)){
                    foundURL= true;
                for (let i = 1; i < getOBJ[index].length; i++) {
                     previous = getOBJ[index][i](req, res, previous);
                    if(previous == false){
                        res.end();//end the responce in case of breaking the loop
                        break;
                    }
                }
            }
        }

        if(foundURL == false){
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
                
                req.on('data', function(data){
                    reqBody  += data
                    if(reqBody.length > 1e7){//limiting size of data to less than 10mb
                        httpMsgs.send413(req,res);
                        reqBodySize = false;
                    }
                });

                req.on("end", function(){
                    if (reqBodySize){
                        for (let i = 1; i < getOBJ[index].length; i++) {
                            previous = postOBJ[index][1](req, res, reqBody, previous);
                           if(previous == false){
                               res.end();//end the responce in case of breaking the loop
                               break;
                           }
                       }
                    
                        
                    }
                    
                })
                
                foundURL = true
            }else{
                // send 404 message if requested url did not match
                httpMsgs.send404(req,res);
            }
                
        }

    }else{
        // unsaported method
        httpMsgs.send405(req,res);

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


/*
===========================================
            GET RELEVENT METHODS
===========================================
*/ 
module.exports.queryExpression = function(){
    /*
        this need to add to url for allowing adding query string 
        for example "/emp"+ app.queryExpression (in the consumer modules);
    */ 
    return "((\\?|\\&)\\w+\\=\\w+)+"
    
}

module.exports.getMethod = function (url, ...callbacks){
    /*
        this adds array of getOBJ 
    */ 
    // code to prevent entry of duplicate url
    for (let index = 0; index < getOBJ.length; index++) {
        if(getOBJ[index][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    var curGetOBJ=[url];
    for (let index = 0; index < middleWere.length; index++) {
        curGetOBJ.push(middleWere[index]);        
    }
    for (let index = 0; index < callbacks.length; index++) {
        curGetOBJ.push(callbacks[index]);
        
    }
    getOBJ.push(curGetOBJ);
}


module.exports.getParsedQuery = function (){
    /*
    Ths returns the parsed query string as JSON object
    */ 
    var curURL = currentURL
    var queryStringIndex = curURL.indexOf("?");
    var qsString = curURL.substr(queryStringIndex + 1, curURL.length);
    return queryString.parse(qsString);
}

/*
=============================
    POST RELEVENT METHODS
=============================
*/ 
module.exports.postMethod = function(url, ...callbacks){
    for (let index = 0; index < postOBJ.length; index++) {
        if(postOBJ[index][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    var curGetOBJ=[url];
    for (let index = 0; index < middleWere.length; index++) {
        curGetOBJ.push(middleWere[index]);        
    }

    for (let index = 0; index < callbacks.length; index++) {
        curGetOBJ.push(callbacks[index]);
        
    }
    getOBJ.push(curGetOBJ);

    }

    /*
    =========================
        MIDDLEWERE
    =========================
    */ 

    var middleWere = [];
    module.exports.use= function(mWere){
        // ADD GENERAL MIDDLE WERE
        middleWere.push(mWere);
    }
