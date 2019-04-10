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
    load_centreline
} from './pl_component_centreline';
import { PlComponentViewerTable } from '../pl_component_viewer_table/pl_component_viewer_table';

export class PlComponentCentreline extends Component {

    constructor() {
        super()
        this.state = {
            
        }
    }

    componentDidMount() {

        var center_line = this.props.center_line;
        var measurements = this.props.measurements;
        var url_centreline = obtainBlobUrl(center_line);

        var myComponent = this;

        load_centreline(url_centreline, measurements,function(diameters){

            var D1 = diameters.D1;
            var D2 = diameters.D2;
            var ampl = diameters.ampl;
            var wat = diameters.wat;
            console.log(D1);
            console.log(D2);

            myComponent.setState({
                D1:D1,
                D2:D2,
                ampl:ampl,
                wat:wat
            })

        });
        
    }

    render_table(){

        var d1 = this.state.D1;
        var d2 = this.state.D2;
        var ampl=this.state.ampl;
        var wat = this.state.wat;

        if(d1 !==undefined && d2 !==undefined){
            return(<PlComponentViewerTable D1={d1} D2={d2} ampl={ampl} wat={wat}/>);
            
        }

    }

    render(){

        return (
            
            <div className="grid-block">
                { this.render_table()}
            </div>
            
        )

    }
    
}