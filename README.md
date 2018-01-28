# jwt-http

![verson](https://img.shields.io/badge/version-0.0.8-green.svg)
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

    var loginMiddleWereMethod = function(req, res, previous){
        var data = queryString.parse(req.body);
        var user = data.user;
        var password = data.password;
        var login; // processs the code from database and using user and password set to true if succusful
        if(login){
            return true
        }else{
            app.HTTPMsgs.send500(req, res, "invalid user and password", false);
            return false
        }

    }
app.setLoginRoute(loginMiddleWereMethod);


//validate  login use in bulit in middle were `validate_login`
//return false in case of failure and return payload if succusful paylod is present in previous var
it contains {"user":"username","expDate":"Sun Jan 28 2018 10:45:08 GMT+0530 (India Standard Time)"}

app.getMethod("/ramya",true, app.validate_login, function (req, res, previous){
        app.httpMsgs.sendJSON(req, res, ({
            name : "Ramya Bilagi",
            age : 35,
            sex : "female"
        }));
        
    });
```
## Assets routes creatation 
1. `assets` folder conatins the script files, css file or image files
2. This can contain sub folder inside.
3. routes generated will be `/style.css` for a file just inside assets folder and for file inside subfolder it will `/subfolder/javascript.js`
4. Image can also included inside this assets folder


```     
    app.setAssetDirRoutes(__dirname + "/assets");

```

## Cookie
This module has two methods set and get cookies presently not for use there need to fix bug regarding res.end() for subsequsent res


---
## httpMsgs
kindly check about this module from this link [htt-msgs](https://www.npmjs.com/package/http-msgs)

## user-groups-roles
kindly check about this module from this link [user-groups-roles](https://www.npmjs.com/package/user-groups-roles)


## To do
1. Need to fix bug at route "/" this is causing error.
2. Need to fix the bug in setCookie method of cookies. 'res.end()' 
2. JWT still need to fix encryption and validation compatable with online tools
3. user-groups-roles


