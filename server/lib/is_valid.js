function validEmail(email) {
	var reg = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
	var match = email.match(reg);

	if (match !== null) {
		return true;
	}
	return false;
}

module.exports = {
	validEmail: validEmail
};