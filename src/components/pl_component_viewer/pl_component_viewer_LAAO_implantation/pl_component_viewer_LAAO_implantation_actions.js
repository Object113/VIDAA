//Import libs
import STLLoader from './../../../libs/STLLoader';
import dat from "./../../../libs/dat.gui.min.js";
import VTKLoader from "./../../../libs/VTKLoader.js";
import TransformControls from "./../../../libs/TransformControls.js";

import {
    create_ampl_AMULET_gui,
    create_Watchman_gui
} from './pl_component_viewer_LAAO_implantation_actions_gui';

import {
    create_line,
    calculate_landing_point
} from './pl_component_viewer_centreline_actions';


var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');


var camera;
var cameraControl;
var renderer;
var scene;
var devices = [];
var control;

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

export function renderView() {

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

    control = new THREE.TransformControls(camera, renderer.domElement);
    control.addEventListener( 'change', renderView );
    scene.add(control);

    window.addEventListener( 'keydown', function ( event ) {

        switch ( event.keyCode ) {

            case 84: // T
                control.setMode( "translate" );
                console.log('Translate');
                break;
            case 82: // R
                control.setMode( "rotate" );
                console.log('Rotate');
                break;
       

        }
    });
    // RENDER VIEW 
    renderView();

    callback(scene); // scene has been initialized
}
var boxcenterLA;
export function loadStl(scene, url, callback) {

    delete3DOBJ(scene, "mesh");

    var loader = new THREE.STLLoader();

    loader.load(url, function (geometry) {

        var params = {
            solidmat: true,
            wireframemat: false
        };
        // Wireframe
        var wireframematerial = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            wireframe: true,
            opacity: 1,
            side: THREE.DoubleSide,
          //  clippingPlanes: clipPlanes,
          //  clipIntersection: !params.clipIntersection
        });

        // Solid
        var material = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
           //  clippingPlanes: clipPlanes,
          //  clipIntersection: !params.clipIntersection
        });

        var mesh1 = new THREE.Mesh(geometry, material);
        scene.add(mesh1);

        var mesh = new THREE.Mesh(geometry, wireframematerial);
        scene.add(mesh);
       // mesh.visible = false;
        mesh1.visible = false;
        //Create gui
      /*  var gui = create_gui(params, mesh, mesh1, renderView);
        placeGUI(gui);*/

        // Bounding box
        var box = new THREE.Box3().setFromObject(mesh1);

        // centro de la mesh
        boxcenterLA = box.getCenter();

        var origin = new THREE.Matrix4();

        scene.add(box);
        origin.set(-1, 0, 0, boxcenterLA.x,
            0, -1, 0, boxcenterLA.y,
            0, 0, 1, -boxcenterLA.z,
            0, 0, 0, 1);


        mesh1.applyMatrix(origin);
        mesh.applyMatrix(origin);
        var data = {};
        data["mesh"] = mesh;
        data["boxcenterLA"] = boxcenterLA;
        callback(data);


    });

}
export function load_centreline(scene, url_center_line, mesh, boxcenterLA,callback) {
    delete3DOBJ(scene, "centreline");
    var loader = new THREE.VTKLoader();
    loader.load(url_center_line, function (geometry) {

        var data = create_line(mesh, boxcenterLA, geometry);
        var centreline = data.positioned_center_line.center_line;
        var origin_LA = data.positioned_center_line.origin_la;
        var centreline_points_obj = data.points;
        
        scene.add(centreline);
        
        // Amplatzer AMULET selection
        var data_landing_ampl = calculate_landing_point(centreline.length, centreline_points_obj, boxcenterLA, mesh, scene, origin_LA, 10, 13);
        var landing_point_ampl = data_landing_ampl.landing_point;
        var arrowHelper_ampl = data_landing_ampl.arrowHelper;
        var lp_coord_ampl = data_landing_ampl.lp_coord;
       // scene.add(landing_point_ampl);
      //  scene.add(arrowHelper_ampl);

        var device_selection_data_ampl = {};
        device_selection_data_ampl["lp"] = landing_point_ampl;
        device_selection_data_ampl["coord"] = lp_coord_ampl;
        device_selection_data_ampl["orientation"] = arrowHelper_ampl;
       
        // Watchman selection
        var data_landing_Wat = calculate_landing_point(centreline.length, centreline_points_obj, boxcenterLA, mesh, scene, origin_LA, 13, 16);
        var landing_point_Wat = data_landing_Wat.landing_point;
        var arrowHelper_Wat = data_landing_Wat.arrowHelper;
        var lp_coord_Wat = data_landing_Wat.lp_coord;
       // scene.add(landing_point_Wat);
      //  scene.add(arrowHelper_Wat);

        var device_selection_data_Wat = {};
        device_selection_data_Wat["lp"] = landing_point_Wat;
        device_selection_data_Wat["coord"] = lp_coord_Wat;
        device_selection_data_Wat["orientation"] = arrowHelper_Wat;

        // First point
        var data_first_point = calculate_landing_point(centreline.length, centreline_points_obj, boxcenterLA, mesh, scene, origin_LA, 0, 10);
        var first_point = data_first_point.landing_point.position;
        var first_vec = data_first_point.normal_vector;
        var first_vec_origin = data_first_point.vector_origin;
        
      //  scene.add(landing_point_ampl);
      //  scene.add(arrowHelper_ampl);
        var device_selection_data = {};
        device_selection_data["ampl"] = device_selection_data_ampl;
        device_selection_data["wat"] = device_selection_data_Wat;
        device_selection_data["first_point"] = first_point;
        device_selection_data["first_vec"] = first_vec;
        device_selection_data["first_vec_origin"] = first_vec_origin;
        device_selection_data["centreline_position"] = centreline.position;
        device_selection_data["centreline"] = centreline_points_obj;
        callback(device_selection_data)


    })
}

export function ampl_device_selection(measurements, device_selection_data) {

    var i = measurements.length - device_selection_data.coord - 1;
    var D1 = measurements[i].d1;
    var D2 = measurements[i].d2;
   
    var D_mean = ((D1 + D2) / 2 + 2);
    var ampl_AMULET = [16, 18, 20, 22, 25, 28, 31, 34];

    var ampl_selected = [];
    // Amplatzer Selection
    var cont = 0;
    for (var i = 0; i <= ampl_AMULET.length - 1; i++) {
        if (D_mean <= ampl_AMULET[i]) {
            ampl_selected.push(i);
            if (i == ampl_AMULET.length - 1) {
                ampl_selected.push(i - 1);

            }
            if (i == 0) {
                ampl_selected.push(i + 1);

            }
        }
        if (D_mean > ampl_AMULET[ampl_AMULET.length - 1]) {
            alert("Amplatzer AMULET Implantation - Not recommended");
        }
        cont++;
    }
    ampl_selected = ampl_selected.filter(function (elem, pos) {
        return ampl_selected.indexOf(elem) == pos;
    });

    ampl_selected.sort();
    if (ampl_selected.length > 3) {
        ampl_selected = [ampl_selected[0], ampl_selected[1], ampl_selected[2]];
    }

    return ampl_selected;
};


export function wat_device_selection(measurements, device_selection_data) {

    var i = measurements.length - device_selection_data.coord - 1;
    var D1 = measurements[i].d1;
    var wat_selected = [];

    if (D1 >= 16.8 && D1 <= 19.3) {
        wat_selected.push(0);
        
    }
    if (D1 >= 19.2 && D1 <= 22.1) {
        wat_selected.push(1);
        
    }
    if (D1 >= 21.6 && D1 <= 24.8) {
        wat_selected.push(2);
       
    }
    if (D1 >= 24 && D1 <= 27.6) {
        wat_selected.push(3);
        
    }
    if (D1 >= 26.4 && D1 <= 30.4) {
        wat_selected.push(4);
        
    }
    if (D1 > 30.4) {
        alert("Watchman Implantation - Not recommended");
    }
    return wat_selected;

}

export function load_ampl_AMULET(ampl_path, device_selection_data, mesh, boxcenterLA, scene, text,
    visibility, amplatzer_folder, devices, renderView, callback) {

    var loader = new THREE.STLLoader();

    loader.load(ampl_path, function (geometry_ampl) {

        var centreline_10_point = device_selection_data.lp.position;
        var material = new THREE.MeshPhongMaterial({ color: 0xfffffff });

        var ampl = new THREE.Mesh(geometry_ampl, material);
        ampl.name=text;

        var origin = new THREE.Matrix4();
        origin.set(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
        ampl.applyMatrix(origin);
        // Posiciones del dispositivo segun Landing Zone definido por la centreline
        var devicepos = new THREE.Matrix4();
        devicepos.set(1, 0, 0, centreline_10_point.x,
            0, 1, 0, centreline_10_point.y,
            0, 0, 1, centreline_10_point.z,
            0, 0, 0, 1);

        ampl.applyMatrix(devicepos);

        var quaternion_LA = new THREE.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
        ampl.applyQuaternion(quaternion_LA);

        ampl.rotation.x = device_selection_data.orientation.rotation.x;
        ampl.rotation.y = device_selection_data.orientation.rotation.y + Math.PI;
        ampl.rotation.z = device_selection_data.orientation.rotation.z;

        ampl.scale.set(1, 1, 1);

        ampl.visible = false;
       

        scene.add(ampl);

        create_ampl_AMULET_gui(text, visibility, amplatzer_folder, ampl,devices, renderView,control);
        
       callback(ampl);
       
    });
};

export function load_Watchman(wat_path, device_selection_data, mesh, boxcenterLA, scene, text,
    visibility, watchman_folder, renderView, callback) {

    var loader = new THREE.STLLoader();

    loader.load(wat_path, function (geometry_wat) {

        var centreline_10_point = device_selection_data.lp.position;
        
        var material = new THREE.MeshPhongMaterial({ color: 0xfffffff });

        var wat = new THREE.Mesh(geometry_wat, material);

        var origin = new THREE.Matrix4();
        origin.set(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
        wat.applyMatrix(origin);
        // Posiciones del dispositivo para la malla del clinic
        var devicepos = new THREE.Matrix4();
        devicepos.set(1, 0, 0, centreline_10_point.x,
            0, 1, 0, centreline_10_point.y,
            0, 0, 1, centreline_10_point.z,
            0, 0, 0, 1);
        wat.applyMatrix(devicepos);

        var quaternion_LA = new THREE.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
        wat.applyQuaternion(quaternion_LA);

        wat.rotation.x = device_selection_data.orientation.rotation.x;
        wat.rotation.y = device_selection_data.orientation.rotation.y + Math.PI;
        wat.rotation.z = device_selection_data.orientation.rotation.z;

        wat.scale.set(1, 1, 1);
        
        wat.visible = false;

        scene.add(wat);
        devices.push(wat);

        create_Watchman_gui(text, visibility, watchman_folder, wat, renderView,control);
        callback(wat);



    });
};

function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}