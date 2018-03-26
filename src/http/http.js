var util = require("util");

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
    if(curMethodURL.search(/\:\w+/) >=0){
        var paramURL = curMethodURL.replace(/\:\w+/, "\\w+");
        
        var paramReg = new RegExp(paramURL);
        var urlMatchParamArray = currentURL.match(paramReg);
    
        if(!util.isNull(urlMatchParamArray)){
            if(urlMatchParamArray[0] == currentURL){
                var index = paramURL.indexOf("\\w+");
                req.param = currentURL.substr(index, currentURL.length);
                return true;
            }

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

   var reqBody ='';//this us reqbody sent
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
               
                // write code for uploads
                // req.on("end", function(){
                    for (let i = 1; i < requestOBJ[index].length; i++) {
                        previous = requestOBJ[index][i](req, res, previous);
                        if(previous == false){
                            if(util.isUndefined(res.statusMessage)){
                                httpMsgs.send500(req, res, "invalid Method");//end the responce in case of breaking the loop
                            } 
                            break;
                        }
                    }     
                // })
            }else{                
            // code req.on
                req.on('data', function(data){
                    reqBody  += data
                    
                        //exmpt mesurment of length for file upload 
                        //set size limit from third party software(multer)
                        if(reqBody.length > 1e7){
                            //limiting size of data to less than 10mb 
                            // for non multipart/form-data
                            httpMsgs.send413(req,res);
                            reqBodySize = false;
                        }
                    
                });//end req,on('data', function(data))
                req.on("end", function(){
                    if (reqBodySize){
                        for (let i = 1; i < requestOBJ[index].length; i++) {
                            req.body = reqBody
                            previous = requestOBJ[index][i](req, res, previous);

                            if(previous == false){
                                if(util.isUndefined(res.statusMessage)){
                                    httpMsgs.send500(req, res, "invalid Method");//end the responce in case of breaking the loop
                                } 
                                break;
                            }
                        }       
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
