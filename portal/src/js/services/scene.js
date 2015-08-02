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
				this.camera = new THREE.PerspectiveCamera(75, 16 / 9, 1, 1000000);
				this.camera.position.y = 9000;
				this.camera.position.z = 23000;

				var gridHelper = new THREE.GridHelper(10000000, 10000);
				gridHelper.position.y = -5000;
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
				ob.rotation.x = data.x ? data.x : ob.rotation.x;
				ob.rotation.y = data.y ? data.y : ob.rotation.y;
				ob.rotation.z = data.z ? data.z : ob.rotation.z;
				return ob;
			};

			this.createAgent = function(id, mine) {

				for (var i = 0; i < this.mainScene.children.length; i++) {
					if (id == this.mainScene.children[i].name && this.mainScene.children[i].type == "user") {
						return;
					}
				}
				var greenMat = new THREE.MeshBasicMaterial({
					color: 0x00ff00,
					wireframe: true
				});
				var blueMat = new THREE.MeshBasicMaterial({
					color: 0xffff00,
					wireframe: false
				});
				var redMat = new THREE.MeshBasicMaterial({
					color: 0xff0000,
					wireframe: true
				});

				var cube = new THREE.Object3D();

				var idGeometry = new THREE.TextGeometry(id, {//"..." + id.slice(-7), {
					font: "helvetiker",
					size: 2000
				}); //new THREE.BoxGeometry( 10000, 10000, 10000 );
				idGeometry.computeBoundingSphere();
				var offset = idGeometry.boundingSphere.radius / 1;
				idGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-offset, 5000, 0));
				var idObj = new THREE.Mesh(idGeometry, blueMat);
				cube.add(idObj);

				var bodyGeometry = new THREE.BoxGeometry(4500, 4500, 15000);
				// bodyGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var body = new THREE.Mesh(bodyGeometry, greenMat)
				cube.add(body);

				var wheelGeometry1 = new THREE.CylinderGeometry(3000, 3000, 2000, 16);
				// wheelGeometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var rear_left = new THREE.Mesh(wheelGeometry1, redMat);
				rear_left.rotation.z = Math.PI / 2;
				rear_left.position.x = -5000;
				rear_left.position.z = 5000;
				rear_left.position.y = -1000;
				cube.add(rear_left);

				var rear_right = new THREE.Mesh(wheelGeometry1, redMat);
				rear_right.rotation.z = Math.PI / 2;
				rear_right.position.x = 5000;
				rear_right.position.z = 5000;
				rear_right.position.y = -1000;
				cube.add(rear_right);

				var front_left = new THREE.Mesh(wheelGeometry1, redMat);
				front_left.rotation.z = Math.PI / 2;
				front_left.position.x = -5000;
				front_left.position.z = -5000;
				front_left.position.y = -1000;
				cube.add(front_left);

				var front_right = new THREE.Mesh(wheelGeometry1, redMat);
				front_right.rotation.z = Math.PI / 2;
				front_right.position.x = 5000;
				front_right.position.z = -5000;
				front_right.position.y = -1000;
				cube.add(front_right);

				cube.wheels = {
					rear_left: rear_left,
					rear_right: rear_right,
					front_left: front_left,
					front_right: front_right
				};

				cube.updateWheels = function(dir) {
					for (var key in cube.wheels) {
						cube.wheels[key].rotation.x += dir * Math.PI / 20;
					}
				}

				cube.name = id;
				cube.type = "user";
				cube.position.x += 2000;
				cube.position.z += 2000;

				if (mine) {
					var controls = new THREE.OrbitControls(this.camera, this.getElement());
					this.agent = cube;
					this.agent.add(this.camera);
					this.addObject(this.agent);
					return this.agent;
				} else {
					this.addObject(cube);
					return cube;
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
				return null
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
				ob.updateWheels(1);
				var els = ob.matrix.elements;
				var v = new THREE.Vector3(els[8], els[9], els[10]);
				ob.position.add(v.clone().setLength(-300));
				cb();
			}

			this.move_backward = function(ob, cb) {
				ob.updateWheels(-1);
				var els = ob.matrix.elements;
				var v = new THREE.Vector3(els[8], els[9], els[10]);
				ob.position.add(v.clone().setLength(300));
				cb();
			}
		}
	}
]);
