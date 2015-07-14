var Channel = function(cb) {
	this.cb = cb;
}

Channel.prototype.sendMessage = function(args) {
	this.cb(args);
}

module.exports = Channel;