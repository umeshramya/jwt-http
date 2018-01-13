var curCrypt = require("crypto-js");

function encode_base64(rawStr){
    var wordArray = curCrypt.enc.Utf8.parse(rawStr);
    var result = curCrypt.enc.Base64.stringify(wordArray);
    return result;

}

function decode_base64(encStr){
    var wordArray = curCrypt.enc.Base64.parse(encStr);
    var result = wordArray.toString(curCrypt.enc.Utf8);
    return result;
}


