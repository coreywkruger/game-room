var roomController = {
	disconnect: function(room, args) {
		room.removeUser(args.data.id);
	},
	translate: function(room, args) {
		room.Sim.translateAgent(args.websocket_id, args.data.x, args.data.y, args.data.z);
	},
	rotate: function(room, args) {
		room.Sim.rotateAgent(args.websocket_id, args.data.x, args.data.y, args.data.z);
	},
	excuse_me: function(room, args) {
		room.removeUser(args.data.id);
	},
	scene_load: function(room, args) {
		room.users[args.websocket_id].sendMessage({
			event: "scene_load",
			data: {
				agents: room.Sim.getAgents()
			},
			websocket_id: args.websocket_id
		});
	},
	scene_updated: function(room, args) {
		room.broadcast({
			event: "scene_updated",
			data: {
				agents: args
			},
			websocket_id: room.id
		});
	},
	scene_add_player: function(room, args) {
		room.broadcast({
			event: "scene_add_player",
			data: {
				agents: args
			},
			websocket_id: room.id
		});
	},
	scene_remove_player: function(room, args) {
		room.broadcast({
			event: "scene_remove_player",
			data: {
				agents: args
			},
			websocket_id: room.id
		});
	}
};

module.exports = roomController;