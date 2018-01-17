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

/*
=================================================================
                MODULE WIDE VARIABLES
=================================================================
*/ 
var port = 8017;//port numner
var currentURL = "";//this stores the last url accesed;
var getOBJ=[]; // this strores all get routes declred by consumer app
var postOBJ=[];// this strors all post routes declred by consumer app

// method to creat http server
module.exports.http  = Http.createServer(function(req,res){
    currentURL = req.url;// setting current url
    //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;
    // GET method
    if(req.method== "GET"){
        var curGetOBJ;
        
        for (let index = 0; index < getOBJ.length; index++) {
            curGetOBJ = new RegExp (getOBJ[index][0]);
            if(currentURL.match(curGetOBJ) == currentURL){
                getOBJ[index][1](req, res);
                foundURL= true;
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
                    postOBJ[index][1](req, res, reqBody);
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

}).listen(port);

console.log ("server is listing at port " + port);//console message for sending port number

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
    // return "\\?[\\w+\\=\\w+\\&]+"; //old regular exporession
    return "((\\?|\\&)\\w+\\=\\w+)+"
}

module.exports.getMethod = function (url, callback){
    /*
        this adds array of getOBJ 
    */ 
    // code to prevent entry of duplicate url
    for (let index = 0; index < getOBJ.length; index++) {
        if(getOBJ[index][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    getOBJ.push([url, callback]);   
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
module.exports.postMethod = function(url, callback){
    for (let index = 0; index < postOBJ.length; index++) {
        if(postOBJ[index][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    postOBJ.push([url, callback]);
}