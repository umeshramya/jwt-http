var exports = module.exports = {};//export set up
/* 
================================================================
            REQUIRED MODULES
=================================================================
*/ 
var Http = require("http");//http require
var queryString = require("querystring");//querystring require
module.exports.httpMsgs = require("./src/http/httpMsgs");//httpMsgs require for sending  responce for export pupose
var httpMsgs = require("./src/http/httpMsgs");//httpMsgs require for local purpose

/*
=================================================================
                MODULE WIDE VARIABLES
=================================================================
*/ 
var port = 9000;//port numner
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
            if(curGetOBJ.test(currentURL)){
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
        var curPostOBJ;
        var reqBody;
    for (let index = 0; index < postOBJ.length; index++) {
        curPostOBJ = new RegExp(postOBJ[index][0]);
        if(curPostOBJ.test(currentURL)){
            
            req.on('data', function(data){
                reqBody  += data
                if(reqBody.length > 1e7){//limiting size of data to less than 10mb
                    httpMsgs.send413(req, res);
                }
            });

            req.on("end", function(){
                postOBJ[index][1](req, res, reqBody);
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
module.exports.queryExpression = "\\?[\\w+\\=\\w+\\&]+";//add this to url in case of regular expression

module.exports.getMethod = function (url, callback){
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
    postOBJ.push([url, callback]);
}

