//Import libs
import STLLoader from './../../../libs/STLLoader';

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');


var camera;

export function obtainBlobUrl(blob) {

    var file = blob[0];
    
    var blob_url = window.URL.createObjectURL(file);
    return blob_url;

}

function createRenderer(container) {

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x1111111, 0);
    renderer.setSize(container.offsetWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.localClippingEnabled = true;

    return renderer;
}

function createCamera(scene) {

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1, 1000);


    camera.position.x = 150;
    camera.position.y = 150;
    camera.position.z = 150;

    camera.lookAt(scene.position);

    return camera;


}

function createLight(scene, camera) {
    // creamos una luz direccional
    var directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
    directionalLight.position.set(100, 10, -50);
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
    directionalLight.position.set(100, -10, -50);
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
    directionalLight.position.set(-100, 10, -50);
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0x1111111);
    scene.add(ambientLight);

    var ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
}


export function initScene(callback) {

    var container = document.getElementById("container-viewer");
    
    var viewerParent = container.parentNode.parentNode;
    var viewerWidth = viewerParent.offsetWidth;
    var viewerHeight = viewerParent.offsetHeight;

    // SCENE
    var scene = new THREE.Scene();
    // CAMERA
    var camera = createCamera(scene);
    // LIGHTS
    createLight(scene, camera);
    // RENDERER
    var renderer = createRenderer(container);
    container.appendChild(renderer.domElement);

    // CONTROLS

    // to rotate the camera and zoom in/out and pan the 3D objects of the scene
    var cameraControl = new TrackballControls(camera, container);

    cameraControl.rotateSpeed = 5;
    cameraControl.zoomSpeed = 5;
    cameraControl.panSpeed = 1;
    cameraControl.staticMoving = true;

    // RESIZE WINDOW

    function onWindowResize() {

        viewerWidth = viewerParent.offsetWidth;
        viewerHeight = viewerParent.offsetHeight;

        camera.aspect = viewerWidth / viewerHeight;
        camera.updateProjectionMatrix();

        cameraControl.handleResize();

        renderer.setSize(viewerWidth, viewerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    // RENDER VIEW 

    function renderView() {
        cameraControl.update();

        renderer.render(scene, camera);

        requestAnimationFrame(renderView);
    }

    renderView();

    callback(scene); // scene has been initialized
}

export function loadStl(scene, url, callback) {

    delete3DOBJ(scene, "mesh");

    var loader = new THREE.STLLoader();

    loader.load(url, function (geometry) {

        // Solid
        var material = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,

        });

        var mesh1 = new THREE.Mesh(geometry, material);
        scene.add(mesh1);


        // Bounding box
        var box = new THREE.Box3().setFromObject(mesh1);

        // centro de la mesh
        var boxcenterLA = box.getCenter();

        var origin = new THREE.Matrix4();

        scene.add(box);
        origin.set(-1, 0, 0, boxcenterLA.x,
            0, -1, 0, boxcenterLA.y,
            0, 0, 1, -boxcenterLA.z,
            0, 0, 0, 1);


        mesh1.applyMatrix(origin);
   
        callback(mesh1);

    });

}

function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}