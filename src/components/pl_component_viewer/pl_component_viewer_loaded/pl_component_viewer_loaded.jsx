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
import { PlComponentViewerMesh } from './../pl_component_viewer_mesh/pl_component_viewer_mesh';
//import { PlComponentViewerClipping } from '../pl_component_viewer_clipping/pl_component_viewer_clipping';
//import { PlComponentViewerLAAOImplantation } from '../pl_component_viewer_LAAO_implantation/pl_component_viewer_LAAO_implantation';
import { PlComponentViewerLoadedButtons } from './pl_component_viewer_loaded_buttons';
//import { PlComponentViewerEmpty } from '../pl_component_viewer_empty/pl_component_viewer_empty';
import { PlComponentViewer } from '../pl_component_viewer';
import {PlComponentViewerLAAOImplantationWithClipping} from './../pl_component_viewer_LAAO_implantation_with_clipping/pl_component_viewer_LAAO_implantation_with_clipping.jsx'
export class PlComponentViewerLoaded extends Component {
    
    constructor() {
        super();

        this.state = {
            data_view: false,
            //clipping: false,
            implantation: false,
            go_back: false,
            home:false,
            clippingPlanes:[]

        };
        
    }
   

    renderViewer() {
        var data = this.state.data_view;
       // var clipping = this.state.clipping;
        var implantation = this.state.implantation;
        var go_back = this.state.go_back;

        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        var measurements = this.props.measurements;
        var clipPlanes = this.state.clipPlanes;
                
        if (data === true) {
            return (<PlComponentViewerMesh mesh={mesh} center_line={center_line} measurements={measurements} this={this}/>);
        };
        /*if (clipping === true) {
            return (<PlComponentViewerClipping mesh={mesh} center_line={center_line} measurements={measurements} this={this}/>);
        }*/
        if (implantation === true) {
           // return (<PlComponentViewerLAAOImplantation mesh={mesh} center_line={center_line} measurements={measurements} this={this} clipPlanes={clipPlanes}/>);
           return (<PlComponentViewerLAAOImplantationWithClipping mesh={mesh} center_line={center_line} measurements={measurements} this={this} clipPlanes={clipPlanes}/>);
        
        }
      //  if (data === false && clipping === false && implantation === false && go_back === false) {
        if (data === false && implantation === false && go_back === false) {
            return (<PlComponentViewerLoadedButtons mesh={mesh} center_line={center_line} measurements={measurements} this={this}/>);
        }
        if (go_back === true) {
            return (<PlComponentViewer/>);
        }
    }

    render() {
        return (
            <div className="grid-block pl-component-viewer" id="dragbox">
                {this.renderViewer()}
            </div>
        );
    }

}







