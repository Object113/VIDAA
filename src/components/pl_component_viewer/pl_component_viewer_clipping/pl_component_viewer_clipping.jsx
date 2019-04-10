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

import { PlComponentViewerClippedLAA } from './pl_component_viewer_clipped_LAA.jsx';

export class PlComponentViewerClipping extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false
        }
    }

    set_action(action) {

        console.log("Set action");

        var father_component = this.props.this;

        if (action === "go_back") {

            father_component.setState({
                go_back: true,
                data_view: false,
                clipping: false,
                implantation: false,
            });

        } else if (action === "data_view") {

            father_component.setState({
                go_back: false,
                data_view: true,
                clipping: false,
                implantation: false,
            });

        } else if (action === "clipping") {

            father_component.setState({
                go_back: false,
                data_view: false,
                clipping: true,
                implantation: false,
            });

        } else if (action === "implantation") {

            father_component.setState({
                go_back: false,
                data_view: false,
                clipping: false,
                implantation: true,
            });
        }
    }

    render_toolbar() {

        return (

            <div className="grid-block">
                <a onClick={this.set_action.bind(this, "go_back")}>Home</a>
                <a onClick={this.set_action.bind(this, "data_view")}>Data View</a>
                <a class="active" onClick={this.set_action.bind(this, "clipping")}>Clipping View</a>
                <a onClick={this.set_action.bind(this, "implantation")}>LAAO Implantation</a>
            </div>

        );

    }

    render() {
        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        var measurements = this.props.measurements;
        return (
            <div className="vertical grid-block pl-component-viewer-clipping">
                <div className="grid-block body">
                    <div clasName="grid-block container-clipping" id="LAA_CL-container-viewer">
                        <PlComponentViewerClippedLAA mesh={mesh} center_line={center_line} measurements={measurements} />
                    </div>
                    <div className="grid-block container-gui-menu shrink" id="container-gui-menu" ></div>
                    </div>
                <div className="grid-block toolbar shrink">
                    {this.render_toolbar()}
                </div>
            </div>
            
        );
    }
}