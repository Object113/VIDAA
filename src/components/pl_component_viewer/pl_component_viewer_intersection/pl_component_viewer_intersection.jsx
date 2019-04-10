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

import React, { Component } from 'react';
import {
    initScene,
    obtainBlobUrl,
    loadStl,
    clippingLAA,
    intersection_calculus
} from './pl_component_viewer_intersection_actions';
import {
    load_centreline
} from './../pl_component_viewer_LAAO_implantation/pl_component_viewer_LAAO_implantation_actions';
import {
    load_centreline2
} from './pl_component_viewer_intersection_orientation';
import {
    calculate_normal_vector,
    all_intersection_calculus
} from './pl_component_viewer_all_intersections_3D';
import {
    acquire_LAA,
} from './pl_component_viewer_LAA_acquisition';
import {
    create_gui,
    placeGUI
} from './pl_component_viewer_intersection_actions_gui';

export class PlComponentViewerIntersection extends Component {

    componentDidMount() {
        var THREE = require('three');
        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        var measurements = this.props.measurements;

        initScene(function (data) {

            var url_mesh = obtainBlobUrl(mesh);
            var url_centreline = obtainBlobUrl(center_line);
            var scene = data.scene;
            var camera = data.camera;
            var renderer = data.renderer;
            var all_planes = [];
            loadStl(scene, url_mesh, function (data) {
                var mesh = data.mesh;
                var boxcenterLA = data.boxcenterLA;
                var device_selection_data = load_centreline(scene, url_centreline, mesh, boxcenterLA, function (device_selection_data) {
                    var data = load_centreline2(url_centreline, mesh, function (data) {
                        var all_vectors = data.all_vectors;
                        var centreline_points = data.centreline_points_obj;
                        var meshLAA = clippingLAA(device_selection_data, mesh, scene, camera, renderer, boxcenterLA, function (result) {
                            // hide arrow helpers
                            device_selection_data.ampl.orientation.visible = false;
                            device_selection_data.wat.orientation.visible = false;
                            // hide landing points
                            device_selection_data.ampl.lp.visible = false;
                            device_selection_data.wat.lp.visible = false;

                            var centreline_position = device_selection_data.centreline_position;
                            var centreline_points_obj = device_selection_data.centreline;
                            var meshLAA = result;


                            // Calculate all normal vectors with respect to the centreline
                            var data = calculate_normal_vector(centreline_points_obj, boxcenterLA, mesh);
                            var centreline_points = data.points;
                            var normal_vectors = data.normal_vectors;
                            var data2 = intersection_calculus(mesh, meshLAA, device_selection_data, all_vectors, scene, boxcenterLA);
                            var D1 = data2.diameters.D1;
                            var D2 = data2.diameters.D2;
                            var contours = data2.contour;

                            // Obtain LAA points automatically
                            var LAA_points = acquire_LAA(contours, meshLAA, mesh, boxcenterLA, device_selection_data, scene);

                            // calculate contours along the centreline
                            var cont = 0;
                            var all_planes = [];
                            for (var i = normal_vectors.length - 1; i > 0; i--) {
                                // Calculate minimum diameter & maximum for amplatzer AMULET selection
                                var D1 = measurements[centreline_points.length - 10 - i].d1;
                                var D2 = measurements[centreline_points.length - 10 - i].d2;
                                var D_mean = ((D1 + D2) / 2) + 6;
                                // Calculate only the intersection of the planes where the device can be implanted
                                if (D_mean >= 16 && D_mean <= 34) {
                                    var data = all_intersection_calculus(mesh, meshLAA, centreline_points[i + 10], normal_vectors[i], scene, boxcenterLA, D1);
                                    all_planes[cont] = data;
                                    cont++;

                                }
                            }
                            var gui = create_gui(all_planes, meshLAA, scene, LAA_points);
                            placeGUI(gui);

                        });
                    });
                });
            })
        });
    }


    render() {

        return (
            <div className="grid-block">

            </div>

        )

    }
}