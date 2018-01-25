/*
    file mangement
*/ 

var fs = require("fs");
var path = require("path");
var dirPath = __dirname +"/cookie"

var getFileNames = function(dir){
    var fileNameArray = [];
    var files = fs.readdirSync(dir)
    for (let index = 0; index < files.length; index++) {
        var next = path.join(dir , files[index]);

        if(fs.lstatSync(next).isDirectory()){
            
            getFileNames(next);

        }else{
            fileNameArray.push(next);
          
        }
        
    }
    console.log(fileNameArray);
}

getFileNames(dirPath);