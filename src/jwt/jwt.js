var curCrypt = require("crypto-js");
var secretKey='PasswordPradyu';//defualt secret key change this in  your application

var encode_base64 = function(rawStr) {//converts raw string 
    var wordArray = curCrypt.enc.Utf8.parse(rawStr);
    var result = curCrypt.enc.Base64.stringify(wordArray);
    return result;
}
var decode_base64 = function(encStr) {
    var wordArray = curCrypt.enc.Base64.parse(encStr);
    var result = wordArray.toString(curCrypt.enc.Utf8);
    return result;
}
var encrypt= function (strBase64, secret) {
    return curCrypt.HmacSHA256(strBase64, secret);
}

exports.setSecretKey = function(secret){
    /*
        use this method before starting the application
    */ 
    secretKey = secret;
}
var createJWT = function (payload) {
    var secret = secretKey;// this accesed from modulewide secrete key
    var header = {
        "typ": "JWT",
        "alg": "HS256"
    };
    var base64Header = encode_base64(header);
    var base64Payload = encode_base64(payload);
    var signeture = encrypt(base64Header + "." + base64Payload, secret);
    var base64Signeture = curCrypt.enc.Base64.stringify(signeture);
    return base64Header.base64Payload.base64Signeture;
}

exports.createJWT = createJWT;


exports.validateJWT= function(jwt){
    // this method validates the JWT recived
    var headerIndex = jwt.indexOf(".", 0);
    var payloadIndex = jwt.indexOf(".", jwt.indexOf);

    var headerEncoded = jwt.substr(0,headerIndex);//encoded
    var payloadEncoded = jwt.substr(headerIndex, payloadIndex);// encoded
    var signeture = jwt.substr(payloadIndex, jwt.length);// this encrypted 

    var payloadDecoded = decode_base64(payloadEncoded); // this decoded message

    //encrypt and encode the payload and compare for validity 
    var checkJWT =createJWT(payloadDecoded);
     if(checkJWT === jwt){
         return payloadDecoded;
     }else{
         return false;
     }

}

