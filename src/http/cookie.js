/*
    This file deals with cookies
*/ 
var queryString = require("querystring");
var setCookie = function(req, res, cookieString ){
    // this sets new cookie 
    res.writeHead(200, {
        'Set-Cookie': cookieString,
        'Content-Type': 'text/plain'
      });
      res.end();
   
}
exports.setCookie =setCookie;

var getCookie = function(req, res, curCookie){
    var cookies = req.headers.cookie;
    var cookieArray = cookies.split(";");
    for (let index = 0; index < cookieArray.length; index++) {
       
        var curJson = queryString.parse(cookieArray[index]);
        var key = Object.keys(curJson);
        if (key[0].trim() == curCookie){
        return curJson[key[0]];           
            
        }
    }
}

exports.getCookie = getCookie;