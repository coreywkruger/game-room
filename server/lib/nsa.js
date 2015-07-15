var config = require('./../config/config.json');
const CryptoJS = require('crypto-js');
const Crypto = require('crypto');
const RSA = require('ursa');

module.exports = {
	random: random,
	randomAsciiString: randomAsciiString,
	randomNumber: randomNumber,
	randomAsciiString: randomAsciiString,
	encryptSession: encryptSession,
	decryptSession: decryptSession,
	hashSession: hashSession
}

function random(length, cb) {
	return randomAsciiString(length);
}

function encryptSession(data) {

	var encrypted = CryptoJS.AES.encrypt(data, config.get('app').session_key);

	return encrypted.toString();
}

function decryptSession(data) {

	var plaintext = CryptoJS.AES.decrypt(data, config.get('app').session_key);

	return plaintext.toString(CryptoJS.enc.Utf8);
}

function hashSession(data) {

	var hash = CryptoJS.HmacSHA1(data, config.get('app').session_key);

	return hash.toString();
}

/** Sync */
function randomString(length, chars) {
	if (!chars) {
		throw new Error('Argument \'chars\' is undefined');
	}

	var charsLength = chars.length;
	if (charsLength > 256) {
		throw new Error('Argument \'chars\' should not have more than 256 characters' + ', otherwise unpredictability will be broken');
	}

	// Use node buil-in crypto lib
	var randomBytes = Crypto.randomBytes(length)
	var result = new Array(length);

	var cursor = 0;
	for (var i = 0; i < length; i++) {
		cursor += randomBytes[i];
		result[i] = chars[cursor % charsLength]
	};

	return result.join('');
}

/** Sync */
function randomNumber(len) {
	var rHex = Crypto.randomBytes(Math.ceil(len / 2)).toString('hex') // convert to hexadecimal format
	var rInt = parseInt(rHex, 16 /* Hex */ );
	var rStr = rInt + "";
	return rStr.slice(0, len) // return required number of characters;
}

/** Sync */
function randomAsciiString(length) {
	return randomString(length,
		'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789');
}