let previous = {};
let req = {};
let res = {};
let reqOGJ = [];

reqOGJ.push("/route");
reqOGJ.push(function(req, res, previous){
    previous.first = "first";
    next(req, res, previous);
})

reqOGJ.pus[Symbol.iterator]();h(function(req, res, previous){
    previous.second = "second";
    next(req, res, previous);
})

reqOGJ.push(function(req, res, previous){
    console.log(previous);
})

let itre= reqOGJ
itre.next();

let next = function(req, res, previous){
    itre.next().value(req, res, previous);
};

next(req, res, previous);





