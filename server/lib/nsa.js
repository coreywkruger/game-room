var config = require('./../config/config.json');
const CryptoJS = require('crypto-js');
const Crypto = require('crypto');
const RSA = require('ursa');

//RSA:
//  http://stackoverflow.com/questions/8520973/how-to-create-a-pair-private-public-keys-using-node-js-crypto

module.exports = {
	bootupCheck: bootupCheck,

	random: random,
	randomAsciiString: randomAsciiString,

	randomNumber: randomNumber,
	randomAsciiString: randomAsciiString,

	encryptWallet: encryptWallet,
	decryptWallet: decryptWallet,

	encryptSession: encryptSession,
	decryptSession: decryptSession,
	hashSession: hashSession
}

function bootupCheck(cb) {
	try {
		var a = encryptWallet('aaaaa');
		var b = encryptSession('aaaaa');
		var c = decryptSession(b);
		var d = hashSession('aaaaa');
	} catch (e) {
		// Log and rethrow
		console.log('Encryption library threw exception');
		throw e;
	}
	if (c != 'aaaaa') {
		throw new Error("Encryption check failed");
	}
}


function random(length, cb) {
	return randomAsciiString(length);
}



function encryptWallet(data) {

	var pub = RSA.createPublicKey(config.get('wallet_public').key, 'base64');

	return pub.encrypt(data, 'utf8', 'base64');
}

function decryptWallet(data) {

	var priv = RSA.createPrivateKey(config.get('wallet_private').key, '', 'base64');

	return priv.decrypt(data, 'base64', 'utf8');
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

/*
function aes_encrypt(data) {

	var encrypted = CryptoJS.AES.encrypt(data, config.get('app').wallet_key);

	return encrypted.toString();
}

function aes_decrypt(data) {

	var plaintext = CryptoJS.AES.decrypt(data, config.get('app').wallet_key);

	return plaintext.toString(CryptoJS.enc.Utf8);
}
*/

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