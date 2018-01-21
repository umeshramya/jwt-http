# jwt-http
# Under developement
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
    app.setPort(8002); //this sets the port number and also listens the server at specified port
```

## GET method routing
```
// routing
    app.getMethod("/umesh", function(req, res){
        app.HTTPMsgs.sendJSON(req, res, {
            name : "Umesh Bilagi",
            age : 47,
            sex : "male"
        });
    });

    app.getMethod("/ramya" , function(req, res){
        app.HTTPMsgs.sendJSON(req, res, {
            name : "Ramya Bilagi",
            age : 35,
            sex : "female"
        });
    });
```
## POST method routing
```
    app.postMethod("/mypost", function(req, res, reqBody){
        var data= JSON.parse(reqBody);//reqBody is data received
        // now use posted data as per need
        // after processing, if data need to send back to client
        var processed_data = {"Processed" : "result"}
        app.HTTPMsgs.sendJSON(req, res, processed_data);   
    });
```
## Middlewere
1. if the midddle were returns false then `res.end()` will be trigered stops the  further process next function or middlewere
2. `previous` variable stores the object returned by previous which can be used by next middlewere this can chained to next function to by just returning it
3. *Middle were are to writen before routes declaration starts*

###  Middle for all routes 
```   
    app.http.use(function(req, res, previous){
    
        //do the process of middle were here
        console.log("general middle were");
        return previous
    });
```
### Middle were for selected routes
```
    //write middle were as function 
    var curMiddlewere = funtion(req, res, previous){
        //code of selected middle were
        console.log("seleted middle were");
        return previous;
    }

    //route using middle were
    app.getMethod("/umesh", curMiddlewere, function(req, res, previous){
        //code to send sendjson
        app.HTTPMsgs.sendJSON(req, res, {
            name : "Umesh Bilagi",
            age : 47,
            sex : "male"
        });
        console.log(previous);//this is from previous middile were
    });

    
```

## Front end 
Front end assets also are to be routed in order to be included in html pages

```
var fs = require("fs"); //fs modukle is needed in routs
//route for index.html 
app.getMethod("/index", function(req, res, previous){
    fs.readFile("./front-end/index.html", null, function(err, data){
        if(err){
            app.HTTPMsgs.send404(req, res);
        }else{
            res.writeHead(200, {"Content-Type" : "text/html"});
            res.write(data);
            res.end();
        }
    });
   
});

//code to include index.html assets that is front.js in this case
app.getMethod("/front.js",  function(req, res, previous){
    fs.readFile("./front.js", null, function(err, data){
    if(err){
        app.HTTPMsgs.send404(req, res);
    }else{
        res.writeHead(200, {"Content-Type" : "text/javascript"});
        res.write(data);
        res.end();
    }
});
});
```

## Login Code useing middlewere
**Login route and its middle were has to be First route before any middle were or route declered**
```
    
    var loginMiddilewere = function(req, res, reqBody, previous){
        var user = reqBody.user;
        var password = reqBody.password;
        var login = false;

        // code to check login if successfull then call app.JWT.createJWT 
        if(login){
            return app.JWT.createJWT({"user" : reqBody.user});
        }else{
            return false;
        }
    }

    app.postMethod("/login", loginMiddilewere, function(req, res, reqBody, previous){
        app.HTTPMsgs.sendJSON(req, res, {"jwt": previous});
    });
```

---
## httpMsgs
req and res are request and responce objects

#### httpMsgs.sendJSON = function(req, res, data)
This  send json object back  after with success 
data = retun data is in JSON format

#### httpMsg.send200 = function(req, res)
This send only 200 status but not data returned 

#### httpMsgs.send500 = function(req,res,err)
This sends error status with error messages
err = this contains error message

#### httpMsgs.send405= function(req, res)
Method not supporetd i.e request.methods supported
1. GET
2. POST
    
#### httpMsags.send404= function(req, res)
Requested page not availeble

#### httpMsgs.send413 = function(req, res)
Requesting for large data, not supported.

## To do
1. Need to fix bug at route "/" this is causing error.
2. JWT still need to fix encryption and validation compatable with online tools
3. user-groups-roles