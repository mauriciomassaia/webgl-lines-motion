(function () {

	Zepto(function ($) {

		var LINES_NUM = 50,
			LINE_PARTS = 50,
			LINE_ANG_INC = 360 / LINES_NUM,
			mouseX = 0,
			mouseY = 0,
			windowHalfX = window.innerWidth >> 1,
			windowHalfY = window.innerHeight >> 1,
			renderer = new THREE.WebGLRenderer({antialias: true}),
			camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000),
			scene = new THREE.Scene(),
			state = 'rotate',
			angleX = 90,
			mesh = new THREE.Object3D(),
			lines = [],
			line,
			color;

		renderer.setSize(window.innerWidth, window.innerHeight);

		camera.position.z = 1000;
		scene.add(camera);
		
		mesh.rotation.x = THREE.Math.degToRad(angleX);
		scene.add(mesh);
		
		for (var i = 0; i < LINES_NUM; i++) {
			color = new THREE.Color();
			color.setHSL(i / LINES_NUM , .6, 0.5);
			lines.push(createLine(color , LINE_ANG_INC * i));
		}

		$('#container').append(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		window.addEventListener( 'resize', onWindowResize, false );

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

		function onDocumentKeyDown ( event ) {
			switch ( event.keyCode ) {
				case 82: // r
					state = ( state == 'freeze' ? 'rotate' : 'freeze' );
					break;
				case 84: // t
					state = 'freeze';
					angleX += 90;
					angleX %= 359;
					mesh.rotation.x = THREE.Math.degToRad( angleX );
					break;
			}
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

			for (var i = 0; i < LINES_NUM; i++) {
				line = lines[i];
				// add the new point
				line.geometry.vertices.unshift(new THREE.Vector3(mouseX, mouseY, mouseY));
				// remove the oldest point
				line.geometry.vertices.pop();
				line.geometry.verticesNeedUpdate = true;
			}

			if (state == 'rotate') {
				mesh.rotation.x += 0.005;
			}

			renderer.render(scene, camera);
		}

		function animate () {
			requestAnimationFrame( animate );
			render();
		}

		animate();
	});
})();