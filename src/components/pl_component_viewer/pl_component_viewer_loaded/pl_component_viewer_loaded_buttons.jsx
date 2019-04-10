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
    obtainBlobUrl
} from './../pl_component_viewer_mesh/pl_component_viewer_mesh_actions';
import { PlComponentViewerMesh } from './../pl_component_viewer_mesh/pl_component_viewer_mesh';
import { PlComponentViewerClipping } from '../pl_component_viewer_clipping/pl_component_viewer_clipping';
import { PlComponentViewerLAAOImplantation } from '../pl_component_viewer_LAAO_implantation/pl_component_viewer_LAAO_implantation';

export class PlComponentViewerLoadedButtons extends Component {
    constructor() {
        super();

    }

    render() {

        var text_data_visualization;
        //var text_clipping;
        var text_implantation;

        var this2 = this.props.this;
        text_data_visualization = <h3>Data visualization</h3>;
       // text_clipping = <h3>Clipping</h3>;
        text_implantation = <h3>Device Implantation</h3>;

        return (
            <div className="grid-block vertical" style={{ overflow: "hidden" }}>

                <div className="grid-block vertical  shrink pl-component-viewer-loaded-message">
                    <h2>Modality Selection:</h2>
                    <div className="left">
                        <div className="grid-block align-center text-center">
                            {text_data_visualization}
                        </div>
                        <div className="grid-block align-center text-center">
                            <p>Visualization of the uploaded data and diameter visualization along LAA</p>
                        </div>

                        <a className="Data_view" onClick={function () {
                            this2.setState({
                                data_view: true
                            });
                        }
                        }>GO!</a>
                    </div>
                    {/*<div className="middle">
                        <div className="grid-block align-center text-center">
                            {text_clipping}
                        </div>
                        <div className="grid-block align-center text-center">
                            <p>Clipping of the LA mesh to focus in the LAA during virtual implantation.</p>
                        </div>
                        <a className="Clipping_button" onClick={function () {
                            this2.setState({
                                clipping: true
                            });

                        }}>GO!</a>
                    </div>*/}
                    <div className="right">
                        <div className="grid-block align-center text-center">
                            {text_implantation}
                        </div>
                        <div className="grid-block align-center text-center">
                            <p>Virtual Implantation with the proposed devices having:</p>
                        </div>
                        <div className="grid-block align-center text-center">
                            <ol class="f">
                                <li>Clipping of the LA mesh to focus in the LAA during virtual implantation.</li>
                                <li>Default position and orientation of the device.</li>
                                <li>2-3 proposed device sizes of each type.</li>
                                <li>Device manipulation: translation (T), rotation (R) and scaling</li>
                            </ol>

                        </div>
                        <a className="Implantation_button" onClick={function () {
                            this2.setState({
                                implantation: true
                            });
                        }}>GO!</a>
                    </div>
                    <a className="previous round" onClick={function () {
                        this2.setState({
                            go_back: true
                        });
                    }}>&#8249;</a>
                    <a className="next round" onClick={function () {
                        this2.setState({
                            data_view: true
                        });
                    }}>&#8250;</a>

                </div>

            </div >

        );

    }
}