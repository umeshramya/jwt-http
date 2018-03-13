var util = require("util");
var formidable = require("formidable"); //for uploading file

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



exports.httpGet = function (req, res, currentURL, getOBJ, httpMsgs, HtmlErrors){
    //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
   
    var foundURL = false;// this variable stores the
    var previous = {} // this variable is for checking weather to call next method in (Middle were)
    for (let index = 0; index < getOBJ.length; index++) {
     
        if(checkUrl(req, res, getOBJ[index][0], currentURL)){
                foundURL= true;// set the found var to true as url is found
            for (let i = 1; i < getOBJ[index].length; i++) {
                previous = getOBJ[index][i](req, res, previous);
               
                if(previous == false){
                    if(util.isUndefined(res.statusMessage)){
                        httpMsgs.send500(req, res, "invalid Method");//end the responce in case of breaking the loop
                    }                
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
        httpMsgs.send404(req, res, HtmlErrors.html404);
    }

}

exports.httpPOst = function(req, res, currentURL, postOBJ, httpMsgs,  HtmlErrors){
     //foundURL is by false if requested URL gets matched then it is set true
    // useful for 404 status
    var foundURL = false;// this variable stores the
    var previous = {} // this variable is for checking weather to call next method in (Middle were)

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
                        if(util.isUndefined(res.statusMessage)){
                            httpMsgs.send500(req, res, "invalid Method");//end the responce in case of breaking the loop
                        } 
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
        httpMsgs.send404(req, res, HtmlErrors.html404);
    }

}


// this mthod set the upload folder:
var uploadFolderPath = "";
var setUpLoadFolder = function(UploadFolderPath){// setting the upload folder
    uploadFolderPath =  UploadFolderPath;//var 
}

module.exports.setUpLoadFolder = setUpLoadFolder;

var upload = function(req, res, httpMsgs){
    // this method uses formidablet to upload file into
        var form = new formidable.IncomingForm();//create new form
        form.parse(req);//parse the form
       if(form.bytesExpected > 200000){// set upper limit for file size
           httpMsgs.send413(req,res);// send 413 error in case of large file size
           return// exit  from this function
       } 

         form.on('fileBegin', function (name, file){//begin loading the file
            uploadedfile = uploadFolderPath + file.name;
            file.path = uploadedfile;// set the path to upload files
            
        });

        form.on('error', function(err) {// send errpr in case
            httpMsgs.send500(req, res, err);
            return;
        });

        form.on('end',  function(){
            httpMsgs.sendJSON(req, res, {// success send sendJSON
                Upload   : "success"
            });
        });
      
    
}

module.exports.upload = upload;


