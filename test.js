const connect = require("connect");
const app = connect();
const httpMsgs = require("http-msgs");
const fs = require("fs");
const http = require("http");

const https = require("https");






function read (req, res, next){
    fs.readFile(__dirname + "/package.json", "utf8", function(err, data){
        if(err){
            httpMsgs.send500(req, res, err);
        }else{
            req.file = data;
            next();
        }
    })
}
app.use(read);





