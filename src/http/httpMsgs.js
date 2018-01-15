let contentType ={"Content-Type" : "application/json"}
exports.sendJSON = function(req, res, data){
    // on succes 
    res.writeHead(200, contentType);
    if(data){
        res.write(JSON.stringify(data));
    }   
    res.end();
}

exports.send200 = function(req, res){
    // 200
    res.writeHead(200, contentType);
    res.end();
}

exports.send500 = function(req,res,err){
    // on error
    res.writeHead(500, "Internal error occured", contentType);
    res.write(JSON.stringify({"data" : "Internal error occured: " + err}));
    res.end();
}

exports.send405 = function(req, res){
    // Method not supporetd ie. GET, POST others not supported
    res.writeHead(405,"Method not supported", contentType);
    res.write(JSON.stringify({"data" : "Method not supported"}));
    res.end();
}


exports.send404 = function(req, res){
    // Requested page not availeble
    res.writeHead(404,"Resource not found", contentType);
    res.write(JSON.stringify({"data" : "Resource not found"}));
    res.end();
}

exports.send413 = function(req, res){
    // Requesting for large data, not supported
    res.writeHead(413, "Request too large", contentType);
    res.write(JSON.stringify({"data" : "Request too large"}));
    res.end();
}