const Agent = require('./agent'),
	THREE = require('three'),
	_ = require('underscore');

var Sim = function(id) {

	var agents = {};

	this.id = id;
	this.max_agents = 10;
	this.needs_update = false;

	var _update;

	this.onUpdate = function(cb) {
		_update = cb;
	}

	this.addAgent = function(id) {
		if (_.size(agents) < this.max_agents) {
			if (agents[id] == undefined) {
				agents[id] = new Agent(id);
				return agents[id];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	this.removeAgent = function(id) {
		if (agents[id]) {
			agents = _.without(agents, id);
		}
	}

	this.getAgents = function() {
		var ags = {};
		for (var a in agents) {
			var agent = agents[a];
			ags[a] = {
				position: agent.getPosition(),
				rotation: agent.getRotation()
			}
		}
		return ags;
	}

	this.getAgent = function(id) {
		return agents[id];
	}

	this.translateAgent = function(id, x, y, z) {
		console.log(x, y, z);
		console.log((new Date()) + " Moving User: ..." + id.slice(-5) + " --> in Room: ..." + this.id.slice(-5));
		if (agents[id]) {
			agents[id].translateX(x);
			agents[id].translateY(y);
			agents[id].translateZ(z);
			_update(id);
			return agents[id].getPosition();
		} else {
			return null;
		}
	}

	this.rotateAgent = function(id, x, y, z) {
		console.log(x, y, z);
		if (agents[id]) {
			agents[id].rotateX(x);
			agents[id].rotateY(y);
			agents[id].rotateZ(z);
			_update(id);
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