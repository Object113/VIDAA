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
import dat from "./../../../libs/dat.gui.min.js";

import {
    create_ampl_AMULET_gui,
    create_Watchman_gui
} from './pl_component_viewer_LAAO_implantation_actions_gui'
var THREE = require('three');
var devices = [];
export function load_ampl_AMULET(ampl_path, device_selection_data, mesh, scene, text,
    visibility, amplatzer_folder, devices, renderView, control, callback) {

    var loader = new THREE.STLLoader();
    loader.load(ampl_path, function (geometry_ampl) {

        var centreline_10_point = device_selection_data.lp.position;
        var material = new THREE.MeshPhongMaterial({ color: 0xfffffff });

        var ampl = new THREE.Mesh(geometry_ampl, material);
        ampl.name = text;

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

        create_ampl_AMULET_gui(text, visibility, amplatzer_folder, ampl, devices, renderView, control);

        callback(ampl);

    });
};

export function load_Watchman(wat_path, device_selection_data, mesh, scene, text,
    visibility, watchman_folder, renderView, control, callback) {

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

        create_Watchman_gui(text, visibility, watchman_folder, wat, renderView, control);
        callback(wat);



    });
};
