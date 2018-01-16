var exports = module.exports = {};
var Http = require("http");
module.exports.httpMsgs = require("./src/http/httpMsgs");
var httpMsgs = require("./src/http/httpMsgs");
var port = 9000;

module.exports.http  = Http.createServer(function(req,res){
    if(req.method== "GET"){
        var foundURL = false;
        for (let index = 0; index < getOBJ.length; index++) {
            if(req.url === getOBJ[index][0]){
                getOBJ[index][1](req, res);
                foundURL= true;
            }
        }

        if(foundURL == false){
            httpMsgs.send404(req,res);
        }



    }else if(req.method=="POST"){

    }else{
        httpMsgs.send405(req,res);

    }

}).listen(port);

console.log ("server is listing at port " + port);


let getOBJ=[];
module.exports.getMethod = function (url, callback){
    var curURL = "";
    curURL = url;
    queryStringIndex = curURL.indexOf("<");
    if (queryStringIndex >= 0){
        getOBJ.push([curURL.substr(0, queryStringIndex), callback]);

    }else{
        getOBJ.push([url, callback]);
    }
   
}
