var sceneServices = angular.module('sceneServices', []);

sceneServices.factory('sceneService', [

	function() {
		return new function() {

			var _self = this;

			this.renderer;
			this.agent;

			this.newScene = function() {
				this.mainScene = new THREE.Scene();
				this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000000);

				var gridHelper = new THREE.GridHelper(10000000, 10000);
				this.mainScene.add(gridHelper);
			};

			this.addObject = function(obj) {
				if (obj instanceof Array) {
					for (var i = 0; i < obj.length; i++) {
						_self.mainScene.add(obj[i]);
					}
				} else {
					_self.mainScene.add(obj);
				}
			};

			this.deleteObject = function(id) {
				_self.mainScene.remove(
					_self.getObject(id)
				);
			};

			this.translateObject = function(id, data) {
				var ob = _self.getObject(id);
				ob.position.x = data.x ? data.x : ob.position.x;
				ob.position.y = data.y ? data.y : ob.position.y;
				ob.position.z = data.z ? data.z : ob.position.z;
				return ob;
			};

			this.createAgent = function(id, mine) {

				var geometry = new THREE.TextGeometry("..." + id.substring(id.length - 5, id.length), {
					font: "helvetiker",
					size: 5000
				}); //new THREE.BoxGeometry( 10000, 10000, 10000 );
				var material = new THREE.MeshBasicMaterial({
					color: 0x00ff00,
					wireframe: true
				});

				geometry.computeBoundingSphere();
				var offset = geometry.boundingSphere.radius / 1;
				geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-offset, 0, 0));

				var cube = new THREE.Mesh(geometry, material);

				cube.id = id;
				cube.position.x += 2000;
				cube.position.z += 2000;

				if (mine) {
					var controls = new THREE.OrbitControls(_self.camera);
					_self.agent = cube;
					_self.agent.add(_self.camera);
					_self.addObject(_self.agent);
				} else {
					_self.addObject(cube);
				}

			};

			this.setRenderer = function() {
				_self.renderer = new THREE.WebGLRenderer({
					antialias: true,
					autoClear: true,
					alpha: true
				});
				_self.renderer.setSize(1000, 1000);
				_self.renderer.setClearColor(0x000000);
				_self.renderer.setClear = true;
				return _self.renderer;
			};

			this.getObject = function(id) {
				for (var i = 0; i < _self.mainScene.children.length; i++) { // console.log(_self.mainScene.children[i].name, id);
					if (_self.mainScene.children[i].id == id) {
						return _self.mainScene.children[i];
					}
				}
				console.log("JLKJDFSL:FKL:DFKLS:DFKLS:KL:FKL:FDKL:");
				return undefined;
			};

			this.getElement = function() {
				return _self.renderer.domElement;
			};

			this.render = function() {
				this.renderer.render(this.mainScene, this.camera);
			};

			this.createMat = function() {
				return new THREE.MeshLambertMaterial({
					color: 0x00ff00,
					wireframe: true
				});
			};


			this.rotate_left = function(ob, cb) {
				ob.rotation.y += Math.PI / 460;
				cb();
			}

			this.rotate_right = function(ob, cb) {
				ob.rotation.y -= Math.PI / 460;
				cb();
			}

			this.move_forward = function(ob, cb) {
				var els = ob.matrix.elements;
				var v = new THREE.Vector3(els[8], els[9], els[10]);
				ob.position.add(v.clone().setLength(-300));
				cb();
			}

			this.move_backward = function(ob, cb) {
				var els = ob.matrix.elements;
				var v = new THREE.Vector3(els[8], els[9], els[10]);
				ob.position.add(v.clone().setLength(300));
				cb();
			}
		}
	}
]);