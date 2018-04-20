

let req= {};
req.params= "params";

let methodurl = '/parameter/:id/:name/:age'
let cururl = '/parameter/24/Radha/28'
let arra = methodurl.split("/:");
let curur = cururl.split("/");

let indexForCurUrlStart = curur.length - arra.length
console.log(arra[1])
console.log(arra.length);
console.log(curur.length);
console.log(indexForCurUrlStart + 1);

req.params[arra[1]] = curur[indexForCurUrlStart + 1];
console.log(req.params.id);



