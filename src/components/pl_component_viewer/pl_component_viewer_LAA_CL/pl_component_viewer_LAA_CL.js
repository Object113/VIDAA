/*
# VIDAA is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# VIDAA is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# VIDAA platform is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details. The software
# cannot be used for clinical decision making.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Ainhoa Marina Aguado Martin
# Carlos Yagüe Méndez
# Andy Luis Olivares
# Oscar Camara
# Xavier Freixa
# Contributors: 
# Ibai Genua
# Álvaro Fernández-Quilez
# Jordi Mill
# María del Pilar García
*/

//Import libs
import STLLoader from './../../../libs/STLLoader';

import {
    // create_gui,
    create_clipping_gui,
    placeGUI
} from './../pl_component_viewer_clipping/pl_component_viewer_clipping_actions_gui';


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

function createRenderer(container) {

    renderer = new THREE.WebGLRenderer();
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

function renderView() {

    cameraControl.update();

    renderer.render(scene, camera);

    requestAnimationFrame(renderView);
}



export function initScene(callback) {

    var container = document.getElementById("LAA_CL-container-viewer");

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
    renderer = createRenderer(container);
    container.appendChild(renderer.domElement);

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
    var data = {};
    data["scene"] = scene;
    data["camera"] = camera
    data["renderer"] = renderer;
    callback(data); // scene has been initialized
}

export function loadStl(scene, url, callback) {

    delete3DOBJ(scene, "mesh");

    var loader = new THREE.STLLoader();

    loader.load(url, function (geometry) {

        // Solid
        var material = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            wireframe: true,
            opacity: 1,

        });

        var mesh1 = new THREE.Mesh(geometry, material);
        mesh1.visible = false;
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

        var data = {};
        data["mesh"] = mesh1;
        data["boxcenterLA"] = boxcenterLA;
        callback(data);

    });

}
export function clippingLAA(device_selection_data, mesh, scene, camera, renderer, callback) {
    var ostium_point = device_selection_data.first_point;
    var first_vec = device_selection_data.first_vec;
    var first_vec_origin = device_selection_data.first_vec_origin;
    first_vec.applyQuaternion(mesh.quaternion);

    camera.position.x = 150;
    camera.position.y = 150;
    camera.position.z = 150;

    var vector1 = new THREE.Vector3(1, 0, 0);
    var vector2 = new THREE.Vector3(0, 1, 0);
    var vector3 = new THREE.Vector3(0, 0, 1);
    // Clip Planes
    var clipPlanes = [new THREE.Plane(vector1, 0),
    new THREE.Plane(vector2, 0),
    new THREE.Plane(vector3, 0)];

    // Bounding box
    var box = new THREE.Box3().setFromObject(mesh);

    var plane1_dim = box.max.x - box.min.x; // plane 1
    plane1_dim = Math.ceil(plane1_dim);
    plane1_dim = plane1_dim + 1;

    var plane2_dim = box.max.y - box.min.y; // plane 2
    plane2_dim = Math.ceil(plane2_dim);
    plane2_dim = plane2_dim + 1;

    var plane3_dim = box.max.z - box.min.z; // plane 3
    plane3_dim = Math.ceil(plane3_dim);
    plane3_dim = plane3_dim + 1;

    // Planos
    var plane1 = new THREE.PlaneHelper(clipPlanes[0], plane1_dim, 0xff0000); // rojo      
    scene.add(plane1);
    var plane2 = new THREE.PlaneHelper(clipPlanes[1], plane2_dim, 0x00ff00); // verde      
    scene.add(plane2);
    var plane3 = new THREE.PlaneHelper(clipPlanes[2], plane3_dim, 0x0000ff); // azul      
    scene.add(plane3);

    // Solid
    var material = new THREE.MeshLambertMaterial({
        color: 0x0174df,
        transparent: true,
        wireframe: true,
        opacity: 1,
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
        clipIntersection: false

    });
    var meshLAA = new THREE.Mesh(mesh.geometry, material);
    meshLAA.position.x = mesh.position.x;
    meshLAA.position.y = mesh.position.y;
    meshLAA.position.z = mesh.position.z;
    meshLAA.rotation.x = mesh.rotation.x;
    meshLAA.rotation.y = mesh.rotation.y;
    meshLAA.rotation.z = mesh.rotation.z;
    meshLAA.matrix.makeRotationFromQuaternion(mesh.quaternion)
    scene.add(meshLAA);
    scene.add(clipPlanes);

    // centre of the mesh after the transformations
    // Bounding box
    var box = new THREE.Box3().setFromObject(meshLAA);

    // centro de la mesh
    var boxcenterLAA = box.getCenter();
    if (ostium_point.x > 0) {
        var x_plane = - ostium_point.x;
    } else {
        var x_plane = ostium_point.x;
    }
    clipPlanes[0].constant = x_plane;
    if (ostium_point.x > 0) {
        clipPlanes[0].normal.x = 1;
    } else {
        clipPlanes[0].normal.x = -1;
    }
    clipPlanes[1].constant = ostium_point.y;
    if (ostium_point.y > 0) {
        clipPlanes[1].normal.y = 1;
    } else {
        clipPlanes[1].normal.y = -1;
    }
    clipPlanes[2].constant = -ostium_point.z;
    if (ostium_point.z > 0) {
        clipPlanes[2].normal.z = 1;
    } else {
        clipPlanes[2].normal.z = -1;
    }

    var params = {
        clipIntersection: true,
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
    var clipping_gui = create_clipping_gui(params, meshLAA, renderView, clipPlanes, plane1, plane1_dim, plane2, plane2, plane3, plane3_dim);
    placeGUI(clipping_gui);
    callback(true);

}
function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}
