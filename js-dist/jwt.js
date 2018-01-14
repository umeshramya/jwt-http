let curCrypt = require("crypto-js");
function encode_base64(rawStr) {
    let wordArray = curCrypt.enc.Utf8.parse(rawStr);
    let result = curCrypt.enc.Base64.stringify(wordArray);
    return result;
}
function decode_base64(encStr) {
    let wordArray = curCrypt.enc.Base64.parse(encStr);
    let result = wordArray.toString(curCrypt.enc.Utf8);
    return result;
}
function encrypt(strBase64, secret) {
    return curCrypt.HmacSHA256(strBase64, secret);
}
function createJWT(payload, secret) {
    let header = {
        "typ": "JWT",
        "alg": "HS256"
    };
    let base64Header = encode_base64(header);
    let base64Payload = encode_base64(payload);
    let signeture = encrypt(base64Header + "." + base64Payload, secret);
    let base64Signeture = curCrypt.enc.Base64.stringify(signeture);
    return base64Header.base64Payload.base64Signeture;
}
