let curCrypt = require("crypto-js");

function encode_base64(rawStr){
    let wordArray = curCrypt.enc.Utf8.parse(rawStr);
    let result = curCrypt.enc.Base64.stringify(wordArray);
    return result;

}

function decode_base64(encStr){
    let wordArray = curCrypt.enc.Base64.parse(encStr);
    let result = wordArray.toString(curCrypt.enc.Utf8);
    return result;
}