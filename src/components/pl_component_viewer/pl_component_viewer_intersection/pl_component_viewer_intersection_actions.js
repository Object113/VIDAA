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


var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');


var camera;
var cameraControl;
var renderer;
var scene;
var tolerance = 0.001;
var pointsOfIntersection = new THREE.Geometry();
var pointOfIntersection = new THREE.Vector3();

THREE.Vector3.prototype.equals = function (v, tolerance) {
    if (tolerance === undefined) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    } else {
        return ((Math.abs(v.x - this.x) < tolerance) && (Math.abs(v.y - this.y) < tolerance) && (Math.abs(v.z - this.z) < tolerance));
    }
}

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

    var container = document.getElementById("Intersection-container-viewer");

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
        var geometry_with_faces = new THREE.Geometry().fromBufferGeometry(geometry);
        // Solid
        var material = new THREE.MeshLambertMaterial({
            color: 0x0174df,
            transparent: true,
            wireframe: true,
            opacity: 1,

        });

        var mesh1 = new THREE.Mesh(geometry_with_faces, material);
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
export function clippingLAA(device_selection_data, mesh, scene, camera, renderer, boxcenterLA, callback) {

    // Solid
    var material = new THREE.MeshLambertMaterial({
        color: 0x0174df,
        transparent: true,
        wireframe: true,
        opacity: 1,
        side: THREE.DoubleSide,


    });
    var meshLAA = new THREE.Mesh(mesh.geometry, material);
    meshLAA.position.x = mesh.position.x;
    meshLAA.position.y = mesh.position.y;
    meshLAA.position.z = mesh.position.z;
    meshLAA.rotation.x = mesh.rotation.x;
    meshLAA.rotation.y = mesh.rotation.y;
    meshLAA.rotation.z = mesh.rotation.z;
    meshLAA.matrix.makeRotationFromQuaternion(mesh.quaternion);

    scene.add(meshLAA);
    callback(meshLAA);

}
function calculate_diameters(contour) {
    var contour_coordinates = contour[0].contour;

    var all_distances = [];
    for (var i = 0; i < contour_coordinates.length; i++) {
        for (var j = 1; j < contour_coordinates.length; j++) {
            var distance = Math.sqrt((Math.pow(contour_coordinates[i].x - contour_coordinates[j].x, 2)) + (Math.pow(contour_coordinates[i].y - contour_coordinates[j].y, 2)) + Math.pow(contour_coordinates[i].z - contour_coordinates[j].z, 2));
            var vector = [distance, i, j];
            all_distances.push(vector);
        }
    }
    var D1;
    for (var i = 1; i < all_distances.length; i++) {
        if (all_distances[i][0] > all_distances[i - 1][0]) {
            D1 = all_distances[i];
        }
    }

    var A = new THREE.Vector3(contour_coordinates[D1[1]].x, contour_coordinates[D1[1]].y, contour_coordinates[D1[1]].z)
    var B = new THREE.Vector3(contour_coordinates[D1[2]].x, contour_coordinates[D1[2]].y, contour_coordinates[D1[2]].z)

    var line = new THREE.Line3(A, B);
    var line_D1 = new THREE.LineSegments(line_D1, new THREE.LineBasicMaterial({
        color: "red"
    }));
    var midpoint = new THREE.Vector3;
    midpoint.x = (contour_coordinates[D1[1]].x + contour_coordinates[D1[2]].x) / 2;
    midpoint.y = (contour_coordinates[D1[1]].y + contour_coordinates[D1[2]].y) / 2;
    midpoint.z = (contour_coordinates[D1[1]].z + contour_coordinates[D1[2]].z) / 2;
    line_D1.translateX(midpoint.x);
    line_D1.translateY(midpoint.y);
    line_D1.translateZ(midpoint.z);

    // Minimum radius calculation
    var min_distances = [];
    for (var i = 0; i < contour_coordinates.length; i++) {
        var distance = Math.sqrt((Math.pow(contour_coordinates[i].x - midpoint.x, 2)) + (Math.pow(contour_coordinates[i].y - midpoint.y, 2)) + Math.pow(contour_coordinates[i].z - midpoint.z, 2));
        var vector = [distance, i];
        min_distances.push(vector);
    }

    var R_min;
    for (var i = 1; i < min_distances.length; i++) {
        if (i !== D1[1] && i !== D1[2]) {
            if (min_distances[i][0] < min_distances[i - 1][0]) {
                R_min = min_distances[i];
            } else {
                R_min = min_distances[i - 1];
            }
        }
    }

    // Minimum diameter calculation from the minimum radius
    // Calculate vector from midpoint to the end of R_min
    var vecA = new THREE.Vector3();
    vecA.x = midpoint.x - contour_coordinates[R_min[1]].x;
    vecA.y = midpoint.y - contour_coordinates[R_min[1]].y;
    vecA.z = midpoint.z - contour_coordinates[R_min[1]].z;
    vecA.normalize();
    var module_vecA = Math.sqrt(Math.pow(vecA.x,2)+Math.pow(vecA.y,2)+Math.pow(vecA.z,2));
    // Calculate vectors from all points to the midpoint
    var all_vectors = [];
    var complementarian_vector;
    for (var i = 0; i < contour_coordinates.length; i++) {
        var vecB = new THREE.Vector3();
        vecB.x = midpoint.x - contour_coordinates[i].x;
        vecB.y = midpoint.y - contour_coordinates[i].y;
        vecB.z = midpoint.z - contour_coordinates[i].z;
        vecB.normalize();
        all_vectors.push(vecB);
        // Calculate angles from vecA to vecB
        var product = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
        var module_vecB = Math.sqrt(Math.pow(vecB.x,2)+Math.pow(vecB.y,2)+Math.pow(vecB.z,2));
        var angle = Math.acos(product/(module_vecA*module_vecB));
        // See if the angle is near to 180º
        if (angle >= Math.PI - 0.05 && angle <= Math.PI + 0.05){
            complementarian_vector = i;
        }
        
    }
    // Calculate minimal distance
    var CD_x = contour_coordinates[R_min[1]].x-contour_coordinates[complementarian_vector].x;
    var CD_y = contour_coordinates[R_min[1]].y-contour_coordinates[complementarian_vector].y;
    var CD_z = contour_coordinates[R_min[1]].z-contour_coordinates[complementarian_vector].z;

    // Distance
    var D2 = Math.sqrt(Math.pow(CD_x,2)+Math.pow(CD_y,2)+Math.pow(CD_z,2));

    var D2_vec = [D2, R_min[1], complementarian_vector];
    // Export data
    var data = {};
    data["D1"] = D1;
    data["D2"] = D2_vec;
    data["line_D1"] = line_D1;
    data["R_min"] = R_min;
    return data;
}
export function intersection_calculus(mesh, meshLAA, device_selection_data, all_vectors, scene, boxcenterLA) {
    var ostium_point = device_selection_data.first_point;

    //  var first_vec = all_vectors[all_vectors.length-1];
    var first_vec = all_vectors[0];
    first_vec.applyQuaternion(mesh.quaternion);

    var vector1 = new THREE.Vector3(first_vec.x, first_vec.y, first_vec.z);

    // Clip Planes
    var clipPlanes = [new THREE.Plane(vector1, 0)];

    // Bounding box
    var box = new THREE.Box3().setFromObject(mesh);

    var plane1_dim = box.max.x - box.min.x; // plane 1
    plane1_dim = Math.ceil(plane1_dim);
    plane1_dim = plane1_dim + 1;

    // Planos
    var plane1 = new THREE.PlaneHelper(clipPlanes[0], plane1_dim, 0xff0000); // rojo      
    plane1.position.x = ostium_point.x;
    plane1.position.y = ostium_point.y;
    plane1.position.z = ostium_point.z;
    plane1.visible = false;

    scene.add(plane1);

    var box = new THREE.Box3().setFromObject(meshLAA);

    // centro de la mesh
    var boxcenterLAA = box.getCenter();


    var params = {
        planeConstant1: 0,
        planeConstant2: 0,
        planeConstant3: 0,
        plane1: true,
        plane2: true,
        plane3: true,
    };

    var plane_width = 35;
    var plane_height = 35;

    var planeGeom = new THREE.PlaneGeometry(plane_width, plane_height);
    plane1.visible = false;
    planeGeom.rotateX(vector1.x);
    planeGeom.rotateY(vector1.y + Math.PI)
    planeGeom.rotateZ(vector1.z);

    planeGeom.translate(plane1.position.x, plane1.position.y, plane1.position.z);

    var planeMaterial = new THREE.MeshBasicMaterial({ color: "white", side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeom, planeMaterial);
    plane.visible = false;
    scene.add(plane);

    var a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    var planePointA = new THREE.Vector3(),
        planePointB = new THREE.Vector3(),
        planePointC = new THREE.Vector3();
    var lineAB = new THREE.Line3(),
        lineBC = new THREE.Line3(),
        lineCA = new THREE.Line3();


    //function drawIntersectionPoints() {
    var mathPlane = new THREE.Plane();

    plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
    plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
    plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
    mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

    meshLAA.geometry.faces.forEach(function (face, idx) {
        meshLAA.localToWorld(a.copy(meshLAA.geometry.vertices[face.a]));
        meshLAA.localToWorld(b.copy(meshLAA.geometry.vertices[face.b]));
        meshLAA.localToWorld(c.copy(meshLAA.geometry.vertices[face.c]));
        lineAB = new THREE.Line3(a, b);
        lineBC = new THREE.Line3(b, c);
        lineCA = new THREE.Line3(c, a);
        setPointOfIntersection(lineAB, mathPlane, idx);
        setPointOfIntersection(lineBC, mathPlane, idx);
        setPointOfIntersection(lineCA, mathPlane, idx);
    });

    var pointsMaterial = new THREE.PointsMaterial({
        size: .5,
        color: 0x00ff00
    });
    var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
    scene.add(points);

    var contours = getContours(pointsOfIntersection.vertices, [], true);
    //console.log("contours", contours);
    
    var contours_data = [];

    contours.forEach(cntr => {

        let cntrGeom = new THREE.Geometry();

        cntrGeom.vertices = cntr;
        var color = Math.random() * 0xffffff;
        var color_string = '#' + Math.floor(color).toString(16);

        let contour = new THREE.Line(cntrGeom, new THREE.LineBasicMaterial({
            color: color_string //0x777777 + 0x777777
        }));

        var contour_data = {};
        contour_data["contour"] = cntr;
        contour_data["color"] = color_string;
        contours_data.push(contour_data);
       // scene.add(contour);
    });



    var planeWidth = plane.geometry.parameters.width;
    var planeHeight = plane.geometry.parameters.height;
    var intersecting_contours_Geo = restrictpointsbydistance(contours_data, planeWidth, planeHeight, ostium_point, scene);
    return intersecting_contours_Geo;
    // }


}


function setPointOfIntersection(line, plane, faceIdx) {
    pointOfIntersection = plane.intersectLine(line);
    if (pointOfIntersection) {
        let p = pointOfIntersection.clone();
        p.faceIndex = faceIdx;
        p.checked = false;
        pointsOfIntersection.vertices.push(p);
    };
}

function getNearestPointIndex(point, points) {
    let index = 0;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (p.checked == false && p.equals(point, tolerance)) {
            index = i;
            break;
        }
    }
    return index;
}

function getPairIndex(point, pointIndex, points) {
    let index = 0;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (i !== pointIndex && p.checked === false && p.faceIndex === point.faceIndex) {
            index = i;
            break;
        }
    }
    return index;
}

function getContours(points, contours, firstRun) {
    // console.log("firstRun:", firstRun);

    let contour = [];

    // find first line for the contour
    let firstPointIndex = 0;
    let secondPointIndex = 0;
    let firstPoint;
    let secondPoint;

    for (let i = 0; i < points.length; i++) {
        if (points[i].checked == true) continue;
        firstPointIndex = i;
        firstPoint = points[firstPointIndex];
        firstPoint.checked = true;
        secondPointIndex = getPairIndex(firstPoint, firstPointIndex, points);
        secondPoint = points[secondPointIndex];
        secondPoint.checked = true;
        contour.push(firstPoint.clone());
        contour.push(secondPoint.clone());
        break;
    }

    contour = getContour(secondPoint, points, contour);
    contours.push(contour);
    let allChecked = 0;
    points.forEach(p => { allChecked += p.checked === true ? 1 : 0; });
    // console.log("allChecked: ", allChecked === points.length);
    if (allChecked !== points.length) { return getContours(points, contours, false); }

    return contours;
}
function restrictpointsbydistance(contours, planeWidth, planeHeight, ostium_point, scene) {
    var max_distance = (Math.sqrt((Math.pow(planeHeight, 2)) + (Math.pow(planeWidth, 2)))) / 2;
    var cont = 0;
    var new_point = new THREE.Geometry();
    var points_contours = [];
    var ostium_point = new THREE.Vector3(ostium_point.x, ostium_point.y, ostium_point.z);
    var points_contours = new THREE.Geometry();
    var cont2 = 0;
    var selected_contours = [];
    for (var i = 0; i < contours.length; i++) {
        var pointsOfIntersection = contours[i].contour;
        var cont = 0;
        var all_points = 0;
        for (var j = 0; j < pointsOfIntersection.length; j++) {
            var actual_distance = Math.sqrt((Math.pow(pointsOfIntersection[j].x - ostium_point.x, 2)) + (Math.pow(pointsOfIntersection[j].y - ostium_point.y, 2)) + (Math.pow(pointsOfIntersection[j].z - ostium_point.z, 2)));
            all_points++;
            if (actual_distance <= max_distance) {
                cont++;
                //new_point.vertices.push(pointsOfIntersection[j])

            }
        }
        var threshold = pointsOfIntersection.length * 90 / 100;


        if (cont >= threshold) {
            //points_contours.vertices.push(new_point);
            cont2++;
            selected_contours.push(i);
            //console.log(i);
        }

    }

    var pointsMaterial1 = new THREE.PointsMaterial({
        size: 1,
        color: "red"
    });


    var cont = 0;
    //var intersecting_contour = new THREE.Geometry;

    var contours_restricted = [];

    for (var i = 0; i < selected_contours.length; i++) {

        contours_restricted.push(contours[selected_contours[i]]);

        var points1 = new THREE.Points(points_contours.vertices[i], pointsMaterial1);
        scene.add(points1);

        var lines1 = new THREE.LineSegments(points_contours.vertices[i], new THREE.LineBasicMaterial({
            color: "yellow"
        }));
        scene.add(lines1);
        cont++;
    }
    var diameters = calculate_diameters(contours_restricted);
    var data = {};
    data["diameters"] = diameters;
    data["contour"] = contours_restricted;
    return data;
}
function getContour(currentPoint, points, contour) {
    let p1Index = getNearestPointIndex(currentPoint, points);
    let p1 = points[p1Index];
    p1.checked = true;
    let p2Index = getPairIndex(p1, p1Index, points);
    let p2 = points[p2Index];
    p2.checked = true;
    let isClosed = p2.equals(contour[0], tolerance);
    if (!isClosed) {
        contour.push(p2.clone());
        return getContour(p2, points, contour);
    } else {
        contour.push(contour[0].clone());
        return contour;
    }

}


function delete3DOBJ(scene, objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}
