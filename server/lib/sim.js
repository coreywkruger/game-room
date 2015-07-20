const Agent = require('./../src/agent'),
	THREE = require('three'),
	roomController = require('../app/controllers/room'),
	_ = require('underscore');

var Sim = function(room) {

	var ROOM = room;

	this.agents = {};
	this.id = room.id;
	this.max_agents = 10;
	this.needs_update = false;
	this.onUpdate;
	this.onNewUser;
	this.onRemoveUser;

	this.onUpdate = function(msg, id) {
		roomController["scene_updated"](ROOM, msg);
	};

	this.onNewUser = function(msg, id) {
		roomController["scene_add_player"](ROOM, msg);
	};

	this.onRemoveUser = function(msg, id) {
		roomController["scene_remove_player"](ROOM, msg);
	};

	this.addAgent = function(id) {
		if (_.size(this.agents) < this.max_agents) {
			if (this.agents[id] == undefined) {
				this.agents[id] = new Agent(id);
				var msg = {};
				msg[id] = {
					position: this.agents[id].getPosition(),
					rotation: this.agents[id].getRotation()
				}
				// console.log("Sim Id: ", this.id);
				this.onNewUser(msg, this.id);
				return this.agents[id];
			}
		}
	}.bind(this);

	this.removeAgent = function(id) {
		if (this.agents[id]) {
			// this.agents = _.without(this.agents, id);
			delete this.agents[id];
			var ags = {};
			ags[id] = id
			this.onRemoveUser(ags);
		}
	}.bind(this);

	this.getAgents = function() {
		var ags = {};
		for (var a in this.agents) {
			var agent = this.agents[a];
			ags[a] = {
				position: agent.getPosition(),
				rotation: agent.getRotation()
			}
		}
		return ags;
	}

	this.getAgent = function(id) {
		return this.agents[id];
	}

	this.translateAgent = function(id, x, y, z) {
		// console.log(x, y, z);
		// console.log((new Date()) + " Moving User: ..." + id.slice(-5) + " --> in Room: ..." + this.id.slice(-5));
		if (this.agents[id]) {
			this.agents[id].translateX(x);
			this.agents[id].translateY(y);
			this.agents[id].translateZ(z);
			this.onUpdate(this.getAgents(), this.id);
			return this.agents[id].getPosition();
		}
	}

	this.rotateAgent = function(id, x, y, z) {
		// console.log(x, y, z);
		if (this.agents[id]) {
			this.agents[id].rotateX(x);
			this.agents[id].rotateY(y);
			this.agents[id].rotateZ(z);
			// console.log("Sim Id: ", this.id);
			this.onUpdate(this.getAgents(), this.id);
			return this.agents[id].getRotation();
		}
	}.bind(this);

	this.distanceBetween = function(id1, id2) {
		if (this.agents[id1] && this.agents[id2]) {
			var p1 = this.getAgent(id1).position;
			var p2 = this.getAgent(id2).position;
			var distance = p1.distanceTo(p2);
			return distance;
		}
	}
}

module.exports = Sim;