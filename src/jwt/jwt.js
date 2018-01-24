var curCrypt = require("crypto-js");
var secretKey='PasswordPradyu';//defualt secret key change this in  your application

var encode_base64 = function(rawStr) {//converts raw string 
    var wordArray = curCrypt.enc.Utf8.parse(JSON.stringify(rawStr));
    var result = curCrypt.enc.Base64.stringify(wordArray);
    return result;
}
var decode_base64 = function(encStr) {
    var wordArray = curCrypt.enc.Base64.parse(encStr);
    var result = wordArray.toString(curCrypt.enc.Utf8);
    return result;
}


exports.setSecretKey = function(secret){
    /*
        use this method before starting the application
    */ 
    secretKey = secret;
}
var createJWT = function (payload, header = {"alg": "HS256", "typ": "JWT" }) {
    var secret = secretKey;// this accesed from modulewide secrete key
    var base64Header = encode_base64(header);
    var base64Payload = encode_base64(payload);
   
    var signeture = curCrypt.HmacSHA256(base64Header + "." + base64Payload, secret);
    
    // var base64Signeture = curCrypt.enc.Base64.stringify(signeture);
    var base64Signeture = encode_base64(signeture);

    return base64Header + "." + base64Payload + "." + base64Signeture;
}

exports.createJWT = createJWT;


exports.validateJWT= function(jwt){
    // this method validates the JWT recived
    var jwtArray = jwt.split(".");
    var headerDecoded = decode_base64(jwtArray[0]);
    var payloadDecoded = decode_base64(jwtArray[1]);
    var checkJWT = createJWT(JSON.parse(payloadDecoded), JSON.parse(headerDecoded));

    if(checkJWT == jwt){
        return payloadDecoded;
    }else{
        return false
    }
    
}


