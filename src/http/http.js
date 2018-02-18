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

    // // code for param
    // var paramURL = curMethodURL;
    // paramURL.replace(/\:\w+/, "\\:\\w+");
    // var paramReg = new RegExp(paramURL);
    // var urlMatchParamArray = currentURL.match(paramReg);
  
    // if(!util.isNull(urlMatchParamArray)){
    //     if(urlMatchParamArray[0] == currentURL)
    //     var index = currentURL.search(/\:\w+/);
    //     req.param = currentURL.substr(index + 1, currentURL.length);
    //     return true;
    // }
    
    return false;
    

}



exports.httpGet = function (req, res, currentURL, getOBJ, httpMsgs){
    //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = true // this variable is for checking weather to call next method in (Middle were)

    for (let index = 0; index < getOBJ.length; index++) {
     
        if(checkUrl(req, res, getOBJ[index][0], currentURL)){
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

}

exports.httpPOst = function(req, res, currentURL, postOBJ, httpMsgs){
     //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = true // this variable is for checking weather to call next method in (Middle were)

    var reqBody ='';//this us reqbody sent
    var reqBodySize = true;//this var for checking the req body size 
    for (let index = 0; index < postOBJ.length; index++) {
        if(checkUrl(req, res, postOBJ[index][0], currentURL)){
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

}
