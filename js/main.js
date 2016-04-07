var container, camera, controls, glScene, glRenderer, headlight;
var particles = [];
var capped = false;

var params = {
  count: 1000,
  radius: 100,
  maxRadius: 1000,
  velocity: 0.1
}

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.y = 500;
  camera.position.z = 1000;

  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  glScene = new THREE.Scene();

  var p1 = makeParticles(params.radius);
  p1.geometry.verticesNeedUpdate = true;
  particles.push(p1);
  glScene.add(p1);


  headlight = new THREE.PointLight( 0xFFFFFF, 0.5 );
  glScene.add( headlight );


  // renderers

  glRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  glRenderer.setClearColor( 0x000000, 0.9 );
  glRenderer.setPixelRatio(window.devicePixelRatio);
  glRenderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( glRenderer.domElement );

  window.addEventListener( 'resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    glRenderer.setSize( window.innerWidth, window.innerHeight );

    render();
  }, false );
}

function animate() {

  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  for (var i = 0; i < particles.length; i++) {
    var points = particles[i].geometry.vertices;
    for (var j = 0; j < points.length; j++) {
      var vertex = points[j];
      if (vertex.length() > params.maxRadius) {
        var _v = new THREE.Vector2(vertex.x, vertex.z);
        _v.normalize().multiplyScalar(params.radius);
        vertex.x = _v.x;
        vertex.z = _v.y;
        vertex.y = 0;
        capped = true;
      } else {
        vertex.x *= 1.005;
        vertex.z *= 1.005;
        vertex.y = 20 * Math.sin(i / 10);
      }
    }
    particles[i].geometry.verticesNeedUpdate = true;
    particles[i].rotation.x += 0.05;
  }


  if (!capped) {
    var p1 = makeParticles(params.radius);
    particles.push(p1);
    glScene.add(p1);
  }

  headlight.position.copy(camera.position);
  glRenderer.render( glScene, camera );
}

function makeParticles(rad) {
  var geometry = new THREE.Geometry();
  var material = new THREE.PointsMaterial( {color: 0xdd206c} );

  for (var i = 0; i < 2*Math.PI; i += 2*Math.PI / params.count) {
    var vertex = new THREE.Vector3();

    vertex.x = rad * Math.sin(i);
    vertex.z = rad * Math.cos(i);
    vertex.y = 0;

    geometry.vertices.push(vertex);
  }

  return new THREE.Points(geometry, material);
}
