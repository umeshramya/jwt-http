# jwt-http

![verson](https://img.shields.io/badge/version-0.0.7-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellowgreen.svg)
![under development](https://img.shields.io/badge/Under-Developement-red.svg)

# Under developement
This is http frame work for developing rest api (back end) and also front end 
Rest api backend responces are served by JSON.
This is a light frame work unopinated supports the middlewere for adding functionlites
```
recomended architure is 
dir: app
    dir:backend
        files/dir:routes //of backend usinf HTTPMsgs
        dir:model database connection and bussiness loging
    dir:frontend
        file/dir:HTML
        file/dir:routes // This routes for front and objects like html css and front javascript files
        files/dir:javascript
        file/dir:styles
    index.js
    package.json
    package-lock.json
    node_nodules
```

***for backend routes advise is /backend/\*\* so that frontend routes do not conflict***

## Feutures
1. JWT
2. user, roles and permssions
3. http


### Requiring the jwt-http
```
    // require jet-http
    var app = require("jwt-http");
    app.setPort(8002); //this sets the port number and also listens the server at specified port
```

### GET method routing
```
// routing
    app.getMethod("/umesh", true,function(req, res){
        app.HTTPMsgs.sendJSON(req, res, JSON.stringify(({
            name : "Umesh Bilagi",
            age : 47,
            sex : "male"
        }));
    });

    app.getMethod("/ramya" , true,function(req, res){
        app.HTTPMsgs.sendJSON(req, res, JSON.stringify({
            name : "Ramya Bilagi",
            age : 35,
            sex : "female"
        }));
    });
```
## POST method routing
```
    app.postMethod("/mypost", true,function(req, res, reqBody){
        var data= querystring.parse(req.body);//reqBody is data received
        // now use posted data as per need
        // after processing, if data need to send back to client

        var processed_data = JSON.stringify(data)
        app.HTTPMsgs.sendJSON(req, res, processed_data);   
    });
```
## Middlewere
1. Middlewere are essentially functions. They process and passes the result to next middlewere or final function
2. middle were can manipulate the req and res. When tthey return a value or values it gets stored in previous argument of next middlewere or final function. 
3. if the midddle were returns false then `res.end()` will be triger a stop to further process next function or middlewere.
4. *Middle were are to writen before routes declaration starts*
5. Middlewere can be classified into two types generic and specific. 
6. Generic applies all backend routes, unless useMiddleWere argument is set false while getMethod and postMethod is being set.

###  Middle for all routes (Generic)
```   
    app.use(function(req, res, previous){
        //do the process of middle were here
        console.log("general middle were");
        return previous
    });
```
### Middle were for selected routes (specific)
```
    //write middle were as function 
    var curMiddlewere = funtion(req, res, previous){
        //code of selected middle were
        console.log("seleted middle were");
        return previous;
    }

    //route using middle were
    //second option in this set false so general middle were is not used but specific middlewere can be used
    app.getMethod("/umesh", false, curMiddlewere, function(req, res, previous){
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
app.sendFile(url, contentType ,path);
1. url is route 
2. contentType is Content-Type i.e text/html, text/javascript, text/css
2. path is actual place of file

```
//html
app.sendFile("/index","text/html", __dirname + "/index.html");

//javascript
app.sendFile("/bundle.js","text/javascript", __dirname + "/javascript");

//css
app.sendFile("/styles","text/css", __dirname + "/style.css");

```

## Render HTML using inbult templeting engine
app.renderHTML(url, path);
1. url is route 
2. path is actual place of file
```
 //url for index.html see below
 http://localhost:9000/index?name=umesh&age=45&sex=male&occ=doctor

 //route for  index.html see below
 app.renderHTML("/index" + app.queryExpression() , __dirname + "/index.html");

// below is index.html page 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>{{name}}</h1>
    <h1>{{age}}</h1>
    <h1>{{sex}}</h1>
    <h1>{{occ}}</h1>
</body>
</html>

```

## Login Code useing middlewere
Login route and its middle were 
```
    //login middlewere
    var loginMiddleWere = function(req, res, previous){
        try {
            var data = queryString.parse(req.body);  
            var user = data.user;
            var password = data.password;
            var loginStatus = false;
            if(util.isString(user) && util.isString(password)){            
                /*
                    ====================
                    //process code check from the database
                    ====================
                */ 
                loginStatus = true //set this only  if succful login occures
            }else{
                throw new Error("invalid form of posting")
            }
            //loginstatus code
            if (loginStatus){
                return user//return the user to be consumed by payload 
            }else{
                app.HTTPMsgs.send500(req, res, "Invalid user and password");
                return false;
            }
            
        } catch (error) {
            // app.HTTPMsgs.send500(req, res, error);
            app.HTTPMsgs.redirectTemporary(req,res,"/index?name=umesh&age=34");

            return false;//prevent excustation next function
        }
    }

    //login post route
    app.postMethod("/login", false, loginMiddleWere, function(req, res, previous){
        var payload = {"user" : previous, "expDate" : Date()};
        app.JWT.setSecretKey("secret");
        app.JWT.createJWT(payload);
        var token = "JWTtoken="   + app.JWT.createJWT(payload)
        app.cookie.setCookie(req, res, token);
    });;
```
## Cookie

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
2. login code for verifying i.e handling header authoriazation bearer code has to be written
2. JWT still need to fix encryption and validation compatable with online tools
3. user-groups-roles
4. complete cookie module
5. write in readme about 301 307 and 308 httpMsgs module
