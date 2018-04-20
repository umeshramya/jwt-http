var util = require("util");
let reqOBJItretor;// this is the itertor for reqOBJ object to be used inside next() function
var reqBody ='';//this us reqbody sent

var checkUrl = function(req, res, curMethodURL, currentURL ){
    //this method checks the matcing url from array return true if yes or false if no
    var curReg = new RegExp(curMethodURL);//this is url from the array
    var urlMatchArray = currentURL.match(curReg);
    if(!util.isNull(urlMatchArray)){
        if(urlMatchArray[0] == currentURL){
            return true;
        }
    }

    // code for param
    if(curMethodURL.search(/(\:\w+)+/) >=0){
        let paramURL = curMethodURL.replace(/\:\w+/g, "\\w+");
        
        let paramReg = new RegExp(paramURL);
        let urlMatchParamArray = currentURL.match(paramReg);
        let paramOBJ = {};
        if(!util.isNull(urlMatchParamArray)){
            let arraMethodUrl = curMethodURL.split("/:");
            let arraCurrentURL = currentURL.split("/");
            let startIndex = arraCurrentURL - arraMethodUrl + 1;
            for (let index = 1; index < arraMethodUrl.length; index++) {
                
                paramOBJ[arraMethodUrl[index]]=arraCurrentURL[index];
            } 

            req.params=paramOBJ
            return true

        }
    }
    return false;
}

module.exports.checkUrl =checkUrl

exports.httpRequest = function(req, res, currentURL, requestOBJ, httpMsgs,  HtmlErrors){
    //foundURL is by false if requested URL gets matched then it is set true
   // useful for 404 status
   var foundURL = false;// this variable stores the
   var previous = {} // this variable is for checking weather to call next method in (Middle were)
   reqOBJItretor="";
   reqBody ='';//this us reqbody sent
   var reqBodySize = true;//this var for checking the req body size 
   for (let index = 0; index < requestOBJ.length; index++) {
       if(checkUrl(req, res, requestOBJ[index][0], currentURL)){
            foundURL = true;// set this true if url is detected
            //look for content type for purpose "multipart/form-data"(file upload)
            var contentType = req.headers["content-type"];
            if(!util.isUndefined(contentType)){
                contentType = contentType.split(";")[0];
            }
            if(contentType == "multipart/form-data" ){              
                // for uploads file 
                reqOBJItretor = requestOBJ[index][Symbol.iterator]();//creat itrator
                reqOBJItretor.next();//this the router 
                next(req, res, next);

            }else{                
            // code req.on
                req.on('data', function(data){
                    reqBody  += data
                        if(reqBody.length > 1e7){
                            //limiting size of data to less than 10mb 
                            httpMsgs.send413(req,res);
                            reqBodySize = false;
                        }
                    
                });//end req,on('data', function(data))
                req.on("end", function(){
                    if (reqBodySize){
                        reqOBJItretor = requestOBJ[index][Symbol.iterator]();//creat itrator
                        reqOBJItretor.next();//this the router 
                        next(req, res, next);
       
                    }//end of if (reqBodySize)
                    
                })//end of req.on("end", function()
        }
            if(foundURL == true){
                break;//break further excuation of loop 
            }     
        }

    }//end of for (let index = 0; index < postOBJ.length; index++)
    
   if (foundURL == false){
       // send 404 message if requested url did not match
       httpMsgs.send404(req, res, HtmlErrors.html404);
   }

}

var next = (req, res, next)=>{
    req.body = reqBody;
    reqOBJItretor.next().value(req, res, next);
}