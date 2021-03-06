# jwt-http

![verson](https://img.shields.io/badge/version-2.0.6-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellowgreen.svg)
![](https://github.com/umeshramya/jwt-http/blob/dev/logo.jpg?raw=true)

This is http frame work for developing rest api (back end) and also frontend.
Rest api backend responces are served by JSON.
This is a light weight frame work, unopinated supports the middleware for adding functionlites


```
recomended architure is 
dir: app
    dir:backend
        files/dir:routes //routes of backend
        dir:model database connection and bussiness logic
            file:conn.js // database connection etc
    dir:frontend
        dir:HTML
            file:index.html
            dir:httmlerror
                404.html
        dir:assets(public folder)
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

***for backend routes advise is /backend/\*\* or /api/\*\* so that frontend routes do not conflict***

## Feutures
1. JWT
2. user, roles and permssions
3. http, https
4. GET, POST, PUT, DELETE
5. file upload

### Requiring the jwt-http
### http set up

```js
// require jet-http
var app = require("jwt-http");
app.setPort(8002); //this sets the port number and also listens the server at specified port
```

### https setup
```js
place private key and certificate or public in the project folder
var options = {
    key : fs.readFileSync(path.join(__dirname, "/key.pem")),
    cert : fs.readFileSync(path.join(__dirname, "/cert.pem"))
}


options ={ 
    key : keyPath,
    cert : certPath
}

app.setHttpsServer(options, 8000);//8000 is port number

```

### GET method routing
```js
// routing
    app.getMethod("/umesh", true,function(req, res){
        app.httpMsgs.sendJSON(req, res, JSON.stringify(({
            name : "Umesh Bilagi",
            age : 47,
            sex : "male"
        }));
    });

    app.getMethod("/ramya" , true, function(req, res){
        app.httpMsgs.sendJSON(req, res, JSON.stringify({
            name : "Ramya Bilagi",
            age : 35,
            sex : "female"
        }));
    });
```
## POST method routing
```js
    app.postMethod("/mypost", true,function(req, res){
        var data= querystring.parse(req.body);//reqBody is data received
        // now use posted data as per need
        // after processing, if data need to send back to client

        var processed_data = JSON.stringify(data)
        app.httpMsgs.sendJSON(req, res, processed_data);   
    });

```
## PUT method routing
```js
app.putMethod("/put", true, function(req, res){
    var data = querystring.parse(req.body);
    console.log(data);
    app.httpMsgs.sendJSON(req, res, {
        done : "done"
    });
})

```

## DELETE method routing
```js
app.deleteMethod ("/delete/:id", true, function(req, res){
    var id = req.params.id
    app.httpMsgs.sendJSON(req, res, {
        deleted_id : id
    });
});
```



## querystring and adding parmeters to url
```js
//first passing seo and human friendly parmeters "/employ/:id"
//above type routes can used where id is parmeter
//req.params contains conatains key value pairs of params and it values;
app.getMethod("/employ/:id", false, function(req, res){
    app.httpMsgs.sendJSON(req, res, {"params" : req.params});
});


// querystring of url
//app.queryExpression() this method extract the query string i.e ?name=Umesh&age=34&sex=45
//app.getParsedQuery() this converts the query querystring in json
var emp = function(req, res){
    app.httpMsgs.sendJSON(req, res, app.getParsedQuery());
}

app.getMethod("/emp" + app.queryExpression(), true, emp);


```

## Middleware
1. Middleware are essentially functions. They process and passes the result to next middleware or final function
2. middle ware can manipulate the req and res.
3. next(req, res, next) will triger further process next function or middleware.
4. *Middleware are to be writen before routes declaration starts*
5. Middleware can be classified into two types generic and specific. 
6. Generic applies all routes, unless usemiddleware argument is set false while route methods (getMethod, postMethod, putMethod, deleteMethod and renderHTML) is being set.

###  Middle for all routes (Generic)
```js   
    app.use(function(req, res, next){
        //do the process of middle ware here
        req.property_generic = "generic"
  
        next(req, res, next);
    });
```
### Middle ware for selected routes (specific)
```js
    //write middle ware as function 
    var curmiddleware = funtion(req, res, next){
    req.property_specific = "specific" 
        next(req, res, next);
    }

    //route using middle ware
    //second option in this set false so general middle ware is not used but specific middleware can be used
    app.getMethod("/umesh", false, curmiddleware, function(req, res, next){
        //code to send sendjson
        app.httpMsgs.sendJSON(req, res, {
            name : "Umesh Bilagi",
            age : 47,
            sex : "male",
            middle : req.property_specific
        });
    });

    
```

## Front end 
Front end assets can also be routed in order to be included in html pages but advice is use public folder method see below
app.sendFile(url, contentType ,path);
1. url is route 
2. contentType is Content-Type i.e text/html, text/javascript, text/css
2. path is actual place of file

```js
//html
app.sendFile("/index","text/html", __dirname + "/index.html");

//javascript
app.sendFile("/bundle.js","text/javascript", __dirname + "/javascript");

//css
app.sendFile("/styles","text/css", __dirname + "/style.css");

```

## Render HTML using inbult templeting engine
use partials like header.html and footer.html similiar to wordpress `app.render.addPartials`
example below
```html
    {{get(header)}}
    <!-- body of main document here -->
    {{get(footer)}}
```
for detailed documentation of render html check npm render-html-async node module

app.renderHTML(url, path, useMiddleware, specificMiddleWare);
1. url is route 
2. path is actual place of file
3. middlWare
```
 //url for index.html see below
 http://localhost:9000/index?name=umesh&age=45&sex=male&occ=doctor

 //route for  index.html see below
 app.renderHTML("/index" + app.queryExpression() , __dirname + "/index.html", true, specific_
 middleWare);

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

## Login Code useing middleware
Login route and its middle ware 
```js

    var loginMiddleWareMethod = function(req, res, next){
        var data = queryString.parse(req.body);
        var user = data.user;
        var password = data.password;
        var login; // processs the code from database and using user and password set to true if succusful
        if(login){
            next(req, res, next);
        }else{
            app.httpMsgs.send500(req, res, "invalid user and password", false);
            return false
        }

    }
    
app.setLoginRoute(loginMiddleWareMethod,"topsecret", 1); //second arg is secrete key and third arg is expire of token in minites
app.setlogout();//this sets get method logout route setting jwt token = "" and route is `/logout`


//validate  login use in bulit in middle ware `validate_login`
//return false in case of failure and return payload if succusful paylod is present in previous middleware 
{
  "user": "username",
  "createdDate": "2018-05-25T05:21:01.482Z",
  "expireInMinutes": 1//integer 
}

app.getMethod("/ramya",true, app.validate_login, function (req, res, next){
        app.httpMsgs.sendJSON(req, res, ({
            name : "Ramya Bilagi",
            age : 35,
            sex : "female"
        }));
        
    });
```
## user-groups-roles
### user-groups-roles can be used in these senriores.
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
From above code `Login Code useing middleware` app.validate_login middleware returns req.jwt this contains a payload with user.
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
## setPublicFolder 
This method set the public folder simlier to setAssetDirRoutes. but files can be  added dynamically hear (i.e at run time) like uploading files and routes creation for them 
1. this method is for setting the public folder
2. adding uploads, javascript file, images styles etc
3. example  app.setPublicFolder('public', __dirname)
4. routes for accessing files from public folder exmple http://www.example.com/public/subfolder/file.type


## Cookie
### First create cookistring 
`var cookieString =setCookieString(req, res, name, value, expires ,maxAge, httponly=true,https=false, SameSite="Strict");`

### call setcookie method
`app.httpMsgs.setCookie(req, res, cookieString, data="",  resEnd=true);`

### call getcookie method access cookie 
`var cuCokkie = app.httpMsgs.getCookie(req, res, curCookie);`



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
```js
example of formidable

app.postMethod("/upload", true,  function(req, res, next){
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
1. sanitazation and XSS
2. HTTP2






