import { registerGLTFLoader } from '../utils/gltf-loader'
const deviceOrientationControl = require('../utils/device-orientation-control.js');

var seletedModel;
var touchX, touchY;
var lon, lat, gradient;
var last_lon, last_lat;

function renderModel(canvas, THREE) {
  registerGLTFLoader(THREE)

  var container, stats, clock, gui, mixer, actions, activeAction, previousAction;
  var camera, scene, renderer, model, face;
  var api = { state: 'Walking' };

  init();
  animate();
  
  function init() {
    lon = -90;
    lat = 0;

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.25, 100);
    camera.position.set(- 5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xe0e0e0);
    //scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
    clock = new THREE.Clock();
    // lights
    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);
    // ground
    // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    // mesh.rotation.x = - Math.PI / 2;
    // scene.add(mesh);
    // var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add(grid);
    // model
    var loader = new THREE.GLTFLoader();
    loader.load('https://file.anyodd.com/7dc6db79a9c5e23ea9f3/RobotExpressive.glb', function (gltf) {
      model = gltf.scene;
      scene.add(model);
      seletedModel = model;
      createGUI(model, gltf.animations)
    }, undefined, function (e) {
      console.error(e);
    });
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
    renderer.setSize(canvas.width, canvas.height);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
  }

  function createGUI(model, animations) {
    var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
    mixer = new THREE.AnimationMixer(model);
    actions = {};
    for (var i = 0; i < animations.length; i++) {
      var clip = animations[i];
      var action = mixer.clipAction(clip);
      actions[clip.name] = action;
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
      }
    }

    // expressions
    face = model.getObjectByName('Head_2');
    activeAction = actions['Walking'];
    activeAction.play();
  }

  function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];
    if (previousAction !== activeAction) {
      previousAction.fadeOut(duration);
    }
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

  function animate() {
    if (lon !== last_lon ||
      lat !== last_lat) {
      last_lon = lon;
      last_lat = lat;
      deviceOrientationControl.modelRotationControl(seletedModel, lon, lat, gradient, THREE);
    }

    var dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    canvas.requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}

function onTouchStart(event) {
  var touch = event.touches[0];
  touchX = touch.x;
  touchY = touch.y;
}

function onTouchMove(event) {
  var touch = event.touches[0];
  var moveX = touch.x - touchX;
  var moveY = touch.y - touchY;
  lon += moveX;
  lat += moveY;
  touchX = touch.x;
  touchY = touch.y;
  gradient = Math.abs(moveX / moveY);
}

module.exports = {
  renderModel,
  onTouchStart,
  onTouchMove
}