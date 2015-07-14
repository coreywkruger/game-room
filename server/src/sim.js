const Agent = require('./agent'),
	THREE = require('three'),
	_ = require('underscore');

var Sim = function() {

	var agents = {};

	this.max_agents = 10;

	this.addAgent = function(id) {
		if (_.size(agents) < this.max_agents) {
			if (agents[id] == undefined) {
				agents[id] = new Agent();
				return agents[id];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	this.deleteAgent = function(id) {
		if (agents[id]) {
			agents = _.without(agents, id);
		}
	}

	this.getAgents = function() {
		return agents;
	}

	this.getAgent = function(id) {
		return agents[id];
	}

	this.translateAgent = function(id, x, y, z) {
		if (agents[id]) {
			agents[id].translateX(x);
			agents[id].translateY(y);
			agents[id].translateZ(z);
			return agents[id].getPosition();
		} else {
			return null;
		}
	}

	this.rotateAgent = function(id, x, y, z) {
		if (agents[id]) {
			agents[id].rotateX(x);
			agents[id].rotateY(y);
			agents[id].rotateZ(z);
			return agents[id].getRotation();
		} else {
			return null;
		}
	}

	this.distanceBetween = function(id1, id2) {
		if (agents[id1] && agents[id2]) {
			var p1 = this.getAgent(id1).position;
			var p2 = this.getAgent(id2).position;
			var distance = p1.distanceTo(p2);
			return distance;
		} else {
			return null;
		}
	}
}

module.exports = Sim;