var sceneServices = angular.module('sceneServices', []);

sceneServices.factory('sceneService', ['$q',

	function($q) {
		return new function() {

			this.renderer;
			this.agent;
			this.mainScene;

			var scenePromise = $q.defer();

			this.newScene = function(force, from) {
				this.mainScene = new THREE.Scene();
				this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 1000000);
				this.camera.position.y = 9000;
				this.camera.position.z = 50000;

				var gridHelper = new THREE.GridHelper(10000000, 10000);
				this.mainScene.add(gridHelper);
				this.setRenderer();
				scenePromise.resolve({
					data: this.mainScene
				});
			}.bind(this);

			this.getScene = function() {
				return scenePromise.promise;
			}.bind(this);

			this.addObject = function(obj) {
				if (obj instanceof Array) {
					for (var i = 0; i < obj.length; i++) {
						this.mainScene.add(obj[i]);
					}
				} else {
					this.mainScene.add(obj);
				}
			}.bind(this);

			this.deleteObject = function(id) {
				this.mainScene.remove(
					this.getObject(id)
				);
			};

			this.translateObject = function(id, data) {
				var ob = this.getObject(id);
				ob.position.x = data.x ? data.x : ob.position.x;
				ob.position.y = data.y ? data.y : ob.position.y;
				ob.position.z = data.z ? data.z : ob.position.z;
				return ob;
			};

			this.rotateObject = function(id, data) {
				var ob = this.getObject(id);
				ob.roatation.x = data.x ? data.x : ob.roatation.x;
				ob.roatation.y = data.y ? data.y : ob.roatation.y;
				ob.roatation.z = data.z ? data.z : ob.roatation.z;
				return ob;
			};

			this.createAgent = function(id, mine) {

				var geometry = new THREE.TextGeometry("..." + id.slice(-5), {
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

				cube.name = id;
				cube.type = "user";
				cube.position.x += 2000;
				cube.position.z += 2000;

				if (mine) {
					var controls = new THREE.OrbitControls(this.camera, this.getElement());
					this.agent = cube;
					this.agent.add(this.camera);
					this.addObject(this.agent);
				} else {
					this.addObject(cube);
				}
			};

			this.setRenderer = function() {
				this.renderer = new THREE.WebGLRenderer({
					antialias: true,
					autoClear: true,
					alpha: true
				});
				this.renderer.setSize(1000, 1000 * (9 / 16));
				this.renderer.setClearColor(0x000000);
				this.renderer.setClear = true;
				return this.renderer;
			};

			this.getObject = function(id) {
				for (var i = 0; i < this.mainScene.children.length; i++) {
					if (this.mainScene.children[i].name == id) {
						return this.mainScene.children[i];
					}
				}
				return undefined;
			};

			this.getElement = function() {
				return this.renderer.domElement;
			};

			this.render = function() {
				this.renderer.render(this.mainScene, this.camera);
			}.bind(this);

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