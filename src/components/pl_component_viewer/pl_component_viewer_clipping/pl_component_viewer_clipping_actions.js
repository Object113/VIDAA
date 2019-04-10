//Import libs
import STLLoader from './../../../libs/STLLoader';
import dat from "./../../../libs/dat.gui.min.js";

import {
    create_gui,
    create_clipping_gui,
    placeGUI
} from './pl_component_viewer_clipping_actions_gui';

var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');


var camera;
var cameraControl;
var renderer;
var scene;

export function obtainBlobUrl(blob) {

    var file = blob[0];

    var blob_url = window.URL.createObjectURL(file);
    return blob_url;

}

function createRenderer() {

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x1111111, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.localClippingEnabled = true;

    return renderer;
}

function createCamera(scene) {

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1, 1000);


    camera.position.x = 250;
    camera.position.y = 250;
    camera.position.z = 250;

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

function renderView() {

    cameraControl.update();

    renderer.render(scene, camera);

    requestAnimationFrame(renderView);
}


export function initScene(callback) {

    var container = document.getElementById("container-viewer");

    var viewerParent = container.parentNode.parentNode;
    var viewerWidth = viewerParent.offsetWidth;
    var viewerHeight = viewerParent.offsetHeight;

    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    camera = createCamera(scene);
    // LIGHTS
    createLight(scene, camera);
    // RENDERER
    renderer = createRenderer();
    container.appendChild(renderer.domElement);

    // CONTROLS

    // to rotate the camera and zoom in/out and pan the 3D objects of the scene
    cameraControl = new TrackballControls(camera, container);

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
    renderView();

    callback(scene); // scene has been initialized
}

export function loadStl(scene, url, callback) {

    delete3DOBJ(scene, "mesh");


    var loader = new THREE.STLLoader();

    loader.load(url, function (geometry) {

        // clipping
        var params = {
            solidmat: true,
            wireframemat: false,
            clipIntersection: false,
            planeConstant1: 0,
            planeConstant2: 0,
            planeConstant3: 0,
            planeOri1: 1,
            planeOri2: 1,
            planeOri3: -1,
            plane1: true,
            plane2: true,
            plane3: true,

        };


        // corte 1
        var vector1 = new THREE.Vector3(1, 0, 0);
        // corte 2
        var vector2 = new THREE.Vector3(0, 0, 1);
        // corte 3
        var vector3 = new THREE.Vector3(0, -1, 0);

        // Clip Planes

        var clipPlanes = [new THREE.Plane(vector1, 0),
        new THREE.Plane(vector2, 0),
        new THREE.Plane(vector3, 0)];

        clipPlanes.matrixAutoUpdate = false;
        scene.add(clipPlanes);


        // Wireframe
        var wireframematerial = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            wireframe: true,
            opacity: 1,
            side: THREE.DoubleSide,
            clippingPlanes: clipPlanes,
            clipIntersection: !params.clipIntersection
        });

        // Solid
        var material = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            clippingPlanes: clipPlanes,
            clipIntersection: !params.clipIntersection
        });

        var mesh1 = new THREE.Mesh(geometry, material);
        scene.add(mesh1);

        var mesh = new THREE.Mesh(geometry, wireframematerial);
        scene.add(mesh);
        mesh.visible = false;

        //Create gui
        var gui = create_gui(params, mesh, mesh1, renderView);
        placeGUI(gui);

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
        mesh.applyMatrix(origin);

        // Para saber el # de slices por eje
        var plane3_dim = box.max.z - box.min.z; // plane 2
        plane3_dim = Math.ceil(plane3_dim);

        var plane2_dim = box.max.y - box.min.y; // plane 1
        plane2_dim = Math.ceil(plane2_dim);

        var plane1_dim = box.max.x - box.min.x; // plane 3
        plane1_dim = Math.ceil(plane1_dim);


        plane1_dim = plane1_dim + 1;
        plane2_dim = plane2_dim + 1;
        plane3_dim = plane3_dim + 1;


        // Planos

        var plane1 = new THREE.PlaneHelper(clipPlanes[0], plane1_dim, 0xff0000); // rojo
        var plane2 = new THREE.PlaneHelper(clipPlanes[1], plane2_dim, 0x00ff00); // verde
        var plane3 = new THREE.PlaneHelper(clipPlanes[2], plane3_dim, 0x0000ff); // azul

        plane1.visible = true;
        scene.add(plane1);
        plane2.visible = true;
        scene.add(plane2);
        plane3.visible = true;
        scene.add(plane3);

        var clipping_gui = create_clipping_gui(params, mesh, mesh1, renderView, clipPlanes, plane1, plane1_dim, plane2, plane2, plane3, plane3_dim);
        placeGUI(clipping_gui);
        callback(clipPlanes);



    });

}


function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}