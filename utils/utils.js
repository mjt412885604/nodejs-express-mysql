var crypto = require('crypto');
var config = require("../config/index");

/**
 * 加密
 * @param {*} str 
 */
function encrypt(str) {
    var cipher = crypto.createCipher('aes192', config.secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

/**
 * 解密
 * @param {*} str 
 */
function decrypt(str) {
    var decipher = crypto.createDecipher('aes192', config.secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}