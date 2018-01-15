# jwt-http
# Umder developement
This is http frame work for developing rest api 
This return data in JSON format and also accept data in JSON format

## Feutures
1. JWT
2. user, roles and permssions
3. http

# Under development

## Requiring the jwt-http
```
// require jet-http
var app = require("jwt-http");
```

## GET method rputing
```
// routing
app.getMethod("/umesh", function(req, res){
    app.httpMsgs.sendJSON(req, res, {
        name : "Umesh Bilagi",
        age : 47,
        sex : "male"
    });
});

app.getMethod("/ramya" , function(req, res){
    app.httpMsgs.sendJSON(req, res, {
        name : "Ramya Bilagi",
        age : 35,
        sex : "female"
    });
});
```
---
## httpMsgs
req and res are request and responce objects

### httpMsgs.sendJSON = function(req, res, data)
This  send json object back  after with success 
data = retun data is in JSON format

### httpMsg.send200 = function(req, res)
This send only 200 status but not data returned 

### httpMsgs,send500 = function(req,res,err)
This sends error status with error messages
err = this contains error message

### httpMsgs.send405= function(req, res)
Method not supporetd i.e request.methods supported
1. GET
2. POST
    
### httpMsags.send404= function(req, res)
Requested page not availeble

### httpMsgs.send413 = function(req, res)
Requesting for large data, not supported.
---