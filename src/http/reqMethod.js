/*
    module for getMethos and postMethod
*/ 
var util = require("util");
var reqMethod = function(url, UseMiddleWere=true,  reqOBJ=[], middleWere=[], ...callbacks){
        /*
        this adds array of reqOBJ 
        UseMiddileWere boolen is for app.use (middlewere) this boolen by defulat is set to true  if set false it does not use middle were
    */ 
    // code to prevent entry of duplicate url
    // "/" this route  is reset to "/index"
    if (url === "/"){
        url = "/index";
    }

    for (let i = 0; i < reqOBJ.length; i++) {
        if(reqOBJ[i][0] == url){
            throw new Error(util.format("This url \"%s\" already exist, so duplication is not allowed", url));
        }   
    }
    var curReqOBJ=[url];
    if(UseMiddleWere){// ads to routes only if UseMiddlewere boolen set to true
        for (let j = 0; j < middleWere.length; j++) {
            curReqOBJ.push(middleWere[j]);        
        }
    }

    for (let k = 0; k < callbacks.length; k++) {
        curReqOBJ.push(callbacks[k]);
        
    }
    reqOBJ.push(curReqOBJ);

}

exports.reqMethod = reqMethod;