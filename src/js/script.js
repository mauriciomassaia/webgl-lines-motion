(function () {

	var DynamicProps = function () {
		this.linesNum = 50;
		this.linesSegments = 50;
		this.speedRotationX = 0.002;
		this.speedRotationY = 0;
		this.speedRotationZ = 0;
		this.easing	= 0.1;
		this.lineParts = 50;
		this.linesNum = 50;
		this.continuousRotation = true;
		this.depthMultiplier = 1;
	};

	Zepto(function ($) {

		var LINES_NUM = 50,
			LINE_PARTS = 50,
			LINE_ANG_INC = 360 / LINES_NUM,
			mouseX = 0,
			mouseY = 0,
			windowHalfX = window.innerWidth >> 1,
			windowHalfY = window.innerHeight >> 1,
			renderer,
			camera,
			scene,
			angleX = 90,
			mesh,
			lines = [],
			line,
			color,
			useMouse = false,
			circularMotion = new CircularMotion(),
			px = 0,
			py = 0,
			dynProps = new DynamicProps();

		setup3d();
		setupControls();
		
		document.getElementById('container').appendChild(renderer.domElement);
		document.getElementById('container').addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		window.addEventListener( 'resize', onWindowResize, false );

		function setup3d () {
			renderer = new THREE.WebGLRenderer({antialias: true});
			camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.z = 1500;
			scene = new THREE.Scene();
			mesh = new THREE.Object3D();
			scene.add(camera);
			
			mesh.rotation.x = THREE.Math.degToRad(angleX);
			scene.add(mesh);
			renderer.setSize(window.innerWidth, window.innerHeight);
			
			for (var i = 0; i < LINES_NUM; i++) {
				color = new THREE.Color();
				color.setHSL(i / LINES_NUM , .6, 0.5);
				lines.push(createLine(color , LINE_ANG_INC * i));
			}
		}

		function createLine (color, angle) {
			var material = new THREE.LineBasicMaterial({color: color, linewidth: 2}),
				geometry = new THREE.Geometry(),
				line;

			for (var i = 0; i < LINE_PARTS; i++) {
				geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			}

			line = new THREE.Line(geometry, material);
			mesh.add(line);
			line.rotation.z = THREE.Math.degToRad(angle);
			return line;
		}

		function setupControls () {
			var gui =  new dat.GUI(),
				folderMotion = gui.addFolder("Auto Movement"),
				folderRotation = gui.addFolder("Rotation");

			dynProps.reset = function () {
				mesh.rotation.x = 0;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
			}

			gui.add(dynProps, 'easing', 0.01, 0.9);
			gui.add(dynProps, 'depthMultiplier', 0.1, 2);

			// gui.add(dynProps, 'linesNum', 10, 100);
			// gui.add(dynProps, 'linesSegments', 10, 100);
			folderRotation.add(dynProps, 'speedRotationX', -0.05, 0.05);
			folderRotation.add(dynProps, 'speedRotationY', -0.05, 0.05);
			folderRotation.add(dynProps, 'speedRotationZ', -0.05, 0.05);
			folderRotation.add(dynProps, 'continuousRotation').listen();
			folderRotation.add(dynProps, 'reset');

			// auto movement props
			folderMotion.add(circularMotion, 'maxOffsetX', 0, 250);
			folderMotion.add(circularMotion, 'maxOffsetY', 0, 250);
			folderMotion.add(circularMotion,'minRadiusX', 0,500);
			folderMotion.add(circularMotion, 'maxRadiusX', 50, 200);
			folderMotion.add(circularMotion, 'minRadiusY', 0, 50);
			folderMotion.add(circularMotion, 'maxRadiusY', 50, 200);
			folderMotion.add(circularMotion, 'minVelX', 0.1, 2);
			folderMotion.add(circularMotion, 'maxVelX', 3, 10);
			folderMotion.add(circularMotion, 'minVelY', 0.1, 2);
			folderMotion.add(circularMotion, 'maxVelY', 3, 10);
		}

		function onDocumentKeyDown ( event ) {
			switch ( event.keyCode ) {
				case 72: // h - hide gui and info
					$('#info').css('display', $('#info').css('display') === 'block' ? 'none' : 'block');
					break;
				case 82: // r
					dynProps.continuousRotation = !dynProps.continuousRotation;
					break;
			}
		}

		function onDocumentMouseDown ( event ) {
			useMouse = !useMouse;
		}

		function onDocumentMouseMove ( event ) {
			mouseX = event.clientX - windowHalfX;
			mouseY = windowHalfY - event.clientY;
		}

		function onWindowResize () {
			windowHalfX = window.innerWidth >> 1;
			windowHalfY = window.innerHeight >> 1;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		function render () {

			if (useMouse) {
				px += (mouseX - px) * dynProps.easing;
				py += (mouseY - py) * dynProps.easing;
			} else {
				circularMotion.update();
				px += (circularMotion.x - px) * dynProps.easing;
				py += (circularMotion.y - py) * dynProps.easing;
			}

			for (var i = 0; i < LINES_NUM; i++) {
				line = lines[i];
				// add the new point
				line.geometry.vertices.unshift( new THREE.Vector3(px, py, py * dynProps.depthMultiplier) );
				// remove the oldest point
				line.geometry.vertices.pop();
				line.geometry.verticesNeedUpdate = true;
			}

			if (dynProps.continuousRotation) {
				mesh.rotation.x += dynProps.speedRotationX;
				mesh.rotation.y += dynProps.speedRotationY;
				mesh.rotation.z += dynProps.speedRotationZ;
			}

			renderer.render(scene, camera);
		}

		function animate () {
			requestAnimationFrame(animate);
			render();
		}

		animate();
	});
})();