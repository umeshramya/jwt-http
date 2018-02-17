
var checkUrl = function(methodOBJ, currentURL ){
    curMethodOBJ = new RegExp(methodOBJ[index][0]);//this is url from the array
    if(curMethodOBJ.test(currentURL)){
        return true;
    }else{
        return false;
    }
    
}

exports.httpGet = function (req, res, currentURL, getOBJ, httpMsgs){
    //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = true // this variable is for checking weather to call next method in (Middle were)
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

}




exports.httpPOst = function(req, res, currentURL, postOBJ, httpMsgs){
     //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = true // this variable is for checking weather to call next method in (Middle were)
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

}
