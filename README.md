# jwt-http

![verson](https://img.shields.io/badge/version-1.0.20-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellowgreen.svg)
![](https://github.com/umeshramya/jwt-http/blob/dev/logo.jpg?raw=true)

This is http frame work for developing rest api (back end) and also frontend.
Rest api backend responces are served by JSON.
This is a light frame work unopinated supports the middlewere for adding functionlites

[![](https://github.com/umeshramya/jwt-http/blob/master/maxresdefault%5B1%5D.jpg?raw=true)](https://www.youtube.com/watch?v=I3SXQ6dbO14&list=PLyGkjsZ-iU9YxEwfsZpfddXtSncVPTRwS)
```javscript
recomended architure is 
dir: app
    dir:backend
        files/dir:routes //routes of backend
        dir:model database connection and bussiness logic
            file:con.js // database connection etc
    dir:frontend
        dir:HTML
            file:index.html
            dir:httmlerror
                404.html
        dir:assets
            dir:scripts
                file:style.css
            dir:styles
                file:script.js
            dir:img
                file:img.jpg

        file/dir:routes//for front end
    index.js
    package.json
    package-lock.json
    node_nodules
```

***for backend routes advise is /backend/\*\* so that frontend routes do not conflict***

## Feutures
1. JWT
2. user, roles and permssions
3. http, https
4. GET, POST, PUT, DELETE
5. file upload

### Requiring the jwt-http
### http set up
```javscript
    // require jet-http
    var app = require("jwt-http");
    app.setPort(8002); //this sets the port number and also listens the server at specified port
```

### https setup
```javscript
place private key and certificate or public in the project folder
var options = {
    key : fs.readFileSync(path.join(__dirname, "/key.pem")),
    cert : fs.readFileSync(path.join(__dirname, "/cert.pem"))
}


options ={ key : keyPath,
    cert : certPath
}

app.setHttpsServer(options, 8000);//8000 is port number





```

### GET method routing
```javscript
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
```javscript
    app.postMethod("/mypost", true,function(req, res, reqBody){
        var data= querystring.parse(req.body);//reqBody is data received
        // now use posted data as per need
        // after processing, if data need to send back to client

        var processed_data = JSON.stringify(data)
        app.HTTPMsgs.sendJSON(req, res, processed_data);   
    });

```
## PUT method routing
```javscript
app.putMethod("/put", true, function(req, res, previous){
    var data = querystring.parse(req.body);
    console.log(data);
    app.httpMsgs.sendJSON(req, res, {
        done : "done"
    });
})

```

## DELETE method routing
```javscript
app.deleteMethod ("/delete/:id", true, function(req, res, previous){
    var id = req.param
    app.httpMsgs.sendJSON(req, res, {
        deleted_id : id
    });
});
```



## querystring and adding parmeters to url
```javscript
//first passing seo and human friendly parmeters "/employ/:id"
//above type routes can used where id is parmeter
//req.param contains the parmeters passed
app.getMethod("/employ/:id", false, function(req, res, previous){
    app.httpMsgs.sendJSON(req, res, {"param" : req.param});
});


// querystring of url
//app.queryExpression() this method extract the query string i.e ?name=Umesh&age=34&sex=45
//app.getParsedQuery() this converts the query querystring in json
var emp = function(req, res){
    app.httpMsgs.sendJSON(req, res, app.getParsedQuery());
}

app.getMethod("/emp" + app.queryExpression(), true, emp);


```

## Middlewere
1. Middlewere are essentially functions. They process and passes the result to next middlewere or final function
2. middle were can manipulate the req and res. When tthey return a value or values it gets stored in previous argument of next middlewere or final function. 
3. if the midddle were returns false then `res.end()` will be triger a stop to further process next function or middlewere.
4. *Middle were are to writen before routes declaration starts*
5. Middlewere can be classified into two types generic and specific. 
6. Generic applies all backend routes, unless useMiddleWere argument is set false while getMethod and postMethod is being set.

###  Middle for all routes (Generic)
```javscript   
    app.use(function(req, res, previous){
        //do the process of middle were here
        previous.property_generic = "generic"
  
        return previous
    });
```
### Middle were for selected routes (specific)
```javscript
    //write middle were as function 
    var curMiddlewere = funtion(req, res, previous){
    previous.property_specific = "specific" 
        return previous;
    }

    //route using middle were
    //second option in this set false so general middle were is not used but specific middlewere can be used
    app.getMethod("/umesh", false, curMiddlewere, function(req, res, previous){
        //code to send sendjson
        app.HTTPMsgs.sendJSON(req, res, {
            name : "Umesh Bilagi",
            age : 47,
            sex : "male",
            middle : previous.property_specific
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

```javscript
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
```javscript

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
app.setLoginRoute(loginMiddleWereMethod)
app.logout()//this sets get method logout route setting jwt token = ""


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
## user-groups-roles
### user-groups-roles can be used in senriores.
1. Inside route
2. Inside the model (business logic)

### process of setting
1. create roles (common for both scenarios)
exmple `createNewRole("admin");`
2. create previlages
3. set add privileges to roles

### Inside route
#### Createing privileges
ex: `createNewPrivileges(["/article", "POST"], "article", false);`
#### add privilges to roles
ex: `addPrivilegeToRole("admin", ["/article", "POST"], true);`
From above code `Login Code useing middlewere` app.validate_login middleware returns req.jwt this contains a payload with user.
Access role of the user from your database.
call this function `getRoleRoutePrivilegeValue = (role, url, method)`. This returns the value of the route privilege

### Inside the model (bussiness logic).
#### Createing privileges
ex: `createNewPrivileges("secureFunctionPrivilege", "this is secured function", false);`
#### add privilges to roles
ex: `addPrivilegeToRole("admin", "secureFunctionPrivilege", true);`.
call this function inside business logic`getRolePrivilegeValue = (role, privilge)`. This returns the value of the  privilege



## Assets routes creatation 
1. `assets` folder conatins the script files, css file or image files
2. This can contain sub folder inside.
3. routes generated will be `/style.css` for a file just inside assets folder and for file inside subfolder it will `/subfolder/javascript.js`
4. Image can also included inside this assets folder


```     
    app.setAssetDirRoutes(__dirname + "/assets");

```

## Cookie
### First create cookistring 
`var cookieString =setCookieString(req, res, name, value, expires ,maxAge, httponly=true,https=false, SameSite="Strict");`

### call setcookie method
`setCookie(req, res, cookieString, data="",  resEnd=true);`

### call getcookie method access cookie 
`var cuCokkie = getCookie(req, res, curCookie);`



---
## httpMsgs
kindly check about this module from this link [http-msgs](https://www.npmjs.com/package/http-msgs)



## handling 404
create route for these and by this method  setRoute404 
create file inthe mentioned path 
```
app.setHTML404(__dirname + "/404.html");
    
```
## file Upload
use third party uploader like multer or formidable
file upload use `enctype="multipart/form-data"`
```javscript
example of formidable

app.postMethod("/upload", true, app.validate_login,  function(req, res, previous){
	var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
	});
	form.on("error", function(error){
		app.httpMsgs.send500(req, res, error);
	})
	form.on("end", function(){
		app.httpMsgs.sendHTML(req, res, "uploded");
	});
});


```


## To do
1. render-html-asyc create components 
2. sanitazation and XSS
3. remove recurssion function for assets and put route matching path directory got by setting 





