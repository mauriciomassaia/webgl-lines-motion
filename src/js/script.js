(function () {

	Zepto(function ($) {

		var mouseX = 0,
			mouseY = 0;
		
		var LINES_NUM = 50,
			LINE_PARTS = 50,
			LINE_ANG_INC = 360 / LINES_NUM,
			lines = [];

		// set the scene size
		var windowHalfX = window.innerWidth >> 1,
			windowHalfY = window.innerHeight >> 1;

		// create a WebGL renderer, camera
		// and a scene
		var renderer = new THREE.WebGLRenderer({antialias: true});
		var camera = new THREE.PerspectiveCamera(
		    33,
		    window.innerWidth / window.innerHeight,
		    1,
		    10000);

		var scene = new THREE.Scene();
		var state = 'freeze';
		var angleX = 90;

		
		// add the camera to the scene
		scene.add(camera);

		scene.add( new THREE.AmbientLight( 0x111111 ) );


		var mesh = new THREE.Object3D();
		mesh.rotation.x = THREE.Math.degToRad(angleX);
		scene.add(mesh);
		
		var light1 = new THREE.PointLight( 0xff0040, 2, 300);
		light1.position.x = 0
		light1.position.y = 100;
		light1.position.z = 200;
		scene.add( light1 );
		/*
		var geometry = new THREE.CubeGeometry( 100, 100, 100 );
		var material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0xfffff, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  )
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = 100
		scene.add( mesh );
		*/
		var color;
		for (var i = 0; i < LINES_NUM; i++) {
			color = new THREE.Color();
			color.setHSL(i / LINES_NUM , .6, 0.5);
			lines.push(createLine(color , LINE_ANG_INC * i));
			// lines.push(createLine(0xfff* (i+1) , LINE_ANG_INC * i));
		};


		// the camera starts at 0,0,0
		// so pull it back
		camera.position.z = 1000;

		renderer.setSize(window.innerWidth, window.innerHeight);
		
		$('#container').append(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		window.addEventListener( 'resize', onWindowResize, false );


		function createLine (color, angle) {



			var material = new THREE.LineBasicMaterial({color: color, linewidth: 2});//, vertexColors: THREE.VertexColors });
			var geometry = new THREE.Geometry();

			// pre set the vertices
			for (var i = 0; i < LINE_PARTS; i++) {
				geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			}

			var line = new THREE.Line(geometry, material);

			mesh.add(line);
			line.rotation.z = THREE.Math.degToRad(angle);
			// line.rotation.y = THREE.Math.degToRad(angle);
			return line;
		}

		function onDocumentKeyDown ( event ) {
			console.log(event);

			switch(event.keyCode) {
				case 82: // r
					state = (state == 'freeze' ? 'rotate' : 'freeze');
					break;
				case 84: // t
					state = 'freeze';
					angleX += 90;
					angleX %= 359;
					mesh.rotation.x = THREE.Math.degToRad(angleX);
					break;

			}
		}

		function onDocumentMouseMove( event ) {
			mouseX = event.clientX - windowHalfX;
			mouseY = windowHalfY - event.clientY;
		}

		function onWindowResize() {
			windowHalfX = window.innerWidth >> 1;
			windowHalfY = window.innerHeight >> 1;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		function render() {
			var line;

			for (var i = 0; i < LINES_NUM; i++) {
				line = lines[i];

				// change the Z axis =)
				// line.geometry.vertices.unshift(new THREE.Vector3(mouseX, mouseY, 0));
				// line.geometry.vertices.unshift(new THREE.Vector3(mouseX, mouseY, mouseY * i >> 1 ));
				// line.geometry.vertices.unshift(new THREE.Vector3(mouseX, mouseY, (i * mouseY) >> 4 ));
				line.geometry.vertices.unshift(new THREE.Vector3(mouseX, mouseY, mouseY));
				line.geometry.vertices.pop();
				line.geometry.verticesNeedUpdate = true;
			};

			// camera.rotation.z += (mouseX / 100 - camera.rotation.z) * .1;

			// mesh.rotation.x = mouseY / 500;
			// mesh.rotation.y = mouseX / 500;
			
			if (state == 'rotate') {
				mesh.rotation.x += 0.005;
			}
			// mesh.rotation.y = mouseX / 500;

			light1.position.x = mouseX;
			light1.position.z = mouseY;

			renderer.render(scene, camera);
		}

		function animate() {
			requestAnimationFrame( animate );
			render();
		}

		animate();
	});
})();