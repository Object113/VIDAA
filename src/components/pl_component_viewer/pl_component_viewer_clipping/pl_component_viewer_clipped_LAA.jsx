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
    obtainBlobUrl,
    loadStl,
    initScene,
    clippingLAA
} from './pl_component_viewer_clipped_LAA_actions'

import {
    load_centreline
} from './../pl_component_viewer_LAAO_implantation/pl_component_viewer_LAAO_implantation_actions';

export class PlComponentViewerClippedLAA extends Component {
    componentDidMount() {

        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        
        initScene(function (data) {

            var url_mesh = obtainBlobUrl(mesh);
            var url_centreline = obtainBlobUrl(center_line);

            var scene = data.scene;
            var camera = data.camera;
            var renderer = data.renderer;
            loadStl(scene, url_mesh, function (data) {
                var mesh = data.mesh;
                var boxcenterLA = data.boxcenterLA;

                load_centreline(scene, url_centreline, mesh, boxcenterLA, function (device_selection_data) {
                    clippingLAA(device_selection_data, mesh, scene, camera, renderer,function(result){
                        // hide arrow helpers
                        device_selection_data.ampl.orientation.visible = false;
                        device_selection_data.wat.orientation.visible = false;
                        // hide landing points
                        device_selection_data.ampl.lp.visible = false;
                        device_selection_data.wat.lp.visible = false;
                    });
            });
        });
    });
}



    render() {

        return (
            <div className="grid-block"></div>

        )

    }
}