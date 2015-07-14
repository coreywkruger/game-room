const THREE = require('three');

var Agent = function(id) {

	this.id = id;

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();

	this.getPosition = function() {
		return {
			x: position.x,
			y: position.y,
			z: position.z
		}
	}

	this.getRotation = function() {
		return {
			x: rotation.x,
			y: rotation.y,
			z: rotation.z
		}
	}

	// position
	this.translateX = function(x) {
		position.x = x;
	}

	this.translateY = function(y) {
		position.y = y;
	}

	this.translateZ = function(z) {
		position.z = z;
	}

	// rotation
	this.rotateX = function(x) {
		rotation.set(x, rotation.y, rotation.z);
	}

	this.rotateY = function(y) {
		rotation.set(rotation.x, y, rotation.z);
	}

	this.rotateZ = function(z) {
		rotation.set(rotation.x, rotation.y, z);
	}
}

module.exports = Agent;