/*
    This file deals with cookies
*/ 

var setCookie = function(req, res, cookieString ){
    // this sets new cookie 
    res.writeHead(200, {
        'Set-Cookie': cookieString,
        'Content-Type': 'text/plain'
      });
    res.end();
}
exports.setCookie =setCookie;

var getCookie = function(req, res, cookieName){

}

exports.getCookie = getCookie;