const connect = require("connect");
const http  = require("http");
const https = require("https");
const httpMsgs = require("http-msgs");

const app = connect();


module.exports.setPort = function(port){
    http.createServer(app)
    return app.listen(port, function(){
        console.log(`http server is listing at port ${port}`);
    })
}

module.exports.sethttpsServer = function(options, port){
    https.createServer(options, app)
    return app.listen(port, function(){
        console.log(`https server is listing at port ${port}`);
    });
}

var getOBJ = [
    ["/", middle, function(req, res){
        httpMsgs.sendJSON(req, res, {
            done : "done",
            middle : req.middle
        })

    }]
]

var middle = function(req, res, next){
    req.middle = "middle";
    next();
}

app.use(function(req, res){
    for (let index = 0; index < getOBJ.length; index++) {
        var currentURL = getOBJ[index][0];
        if(req.url == currentURL){
            for (let i = 0; i < getOBJ[index].length; i++) {
                app.use(getOBJ[index][i]);
                
            }
        }
        
    }


})







