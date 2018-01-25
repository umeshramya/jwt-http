let contentType ={"Content-Type" : "application/json"}
/*
    ==================
        200  plus status
    ==================
*/

exports.sendJSON = function(req, res, data, resEnd=true){
    // on succes 
    res.writeHead(200, contentType);
    if(data){
        res.write(JSON.stringify(data));
    }
  
    if(resEnd){         
        res.end();     
    }
     

}

exports.send200 = function(req, res,  resEnd=true){
    // 200
    res.writeHead(200, contentType);
    if(resEnd){         
        res.end();     
    }
}

/*
    ======================
        300  plus status
    ======================
*/
exports.movedPermently = function(req, res, url, resEnd=true){
    // redirect temporary
    res.writeHead(301,{Location: url } );  
    if(resEnd){         
        res.end();     
    }
}
exports.redirectTemporary = function(req, res, url,  resEnd=true){
    // redirect temporary
    res.writeHead(301,{Location: url } ); 
        if(resEnd){         
            res.end();     
        }
}

exports.redirectPerment = function(req, res, url,  resEnd=true){
    // redirect perment
    res.writeHead(301,{Location: url } ); 
        if(resEnd){         
            res.end();     
        }
}


/*
    ======================
        400  plus status
    ======================
*/

exports.send404 = function(req, res,  resEnd=true){
    // Requested page not availeble
    res.writeHead(404,"Resource not found", contentType);
    res.write(JSON.stringify({"data" : "Resource not found"}));
        if(resEnd){         
            res.end();     
        }
}

exports.send405 = function(req, res,  resEnd=true){
    // Method not supporetd ie. GET, POST others not supported
    res.writeHead(405,"Method not supported", contentType);
    res.write(JSON.stringify({"data" : "Method not supported"}));
        if(resEnd){         
            res.end();     
        }
}

exports.send413 = function(req, res,  resEnd=true){
    // Requesting for large data, not supported
    res.writeHead(413, "Request too large", contentType);
    res.write(JSON.stringify({"data" : "Request too large"}));
        if(resEnd){         
            res.end();     
        }
}

/*
    ==================
        500 status
    ==================
*/ 

exports.send500 = function(req, res, err,  resEnd=true){
    // on error
    res.writeHead(500, "Internal error occured", contentType);
    res.write(JSON.stringify({"data" : "Internal error occured: " + err}));
        if(resEnd){         
            res.end();     
        }
}