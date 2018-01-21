/*
    This modules stores methods releted to files routing
    Mostly useful for front end develiopment
*/ 

var fs = require("fs");


send404 = function(req, res){
    // Requested page not availeble
    res.writeHead(404,"Resource not found", "text/plain");
    res.write("Error 404, Resource not found");
    res.end();
}


exports.sendHtmlFile = function(req, res, path){
    fs.readFile(path,null,function(err, data){
        if(err){
            send404(req, res);
        }else{
            res.writeHead(200, {"Content-Type" : "text/html"});
            res.write(data);
            res.end();
        }

    });
}

exports.sendJavascriptFile = function(req, res, path){
    fs.readFile(path, null, function(err, data){
        if(err){
            send404(req, res);
        }else{
            res.writeHead(200, {"Content-Type" : "text/javascript"});
            res.write(data);
            res.end();
        }

    });
}

exports.sendCssFile = function(req, res, path){
    fs.readFile(path, null, function(err, data){
        if(err){
            send404(req, res);
        }else{
            res.writeHead(200, {"Content-Type" : "text/stylesheet"});
            res.write(data);
            res.end();
        }

    });
}

