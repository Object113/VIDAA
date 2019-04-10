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


export class PlComponentViewerTable extends Component {

    render() {

        var d1 = this.props.D1;
        var d2 = this.props.D2;
        var ampl = this.props.ampl;
        var wat = this.props.wat;
        return (

            <div className="grid-block pl-component-viewer-table">
                <div className="grid-block vertical">
                    <div className="grid-block align-center shrink item"><b>Max. Diameter (D1)</b></div>
                    <div className="grid-block align-center shrink item">{d1}</div>
                    <div className="grid-block align-center shrink item"><b>Amplatzer AMULET <br />size (mm)</b></div>
                    <div className="grid-block align-center shrink item">{ampl[0]}</div>
                </div>
                <div className="grid-block vertical">
                    <div className="grid-block align-center shrink item"><b>Min. Diameter (D2)</b></div>
                    <div className="grid-block align-center shrink item">{d2}</div>
                    <div className="grid-block align-center shrink item"><b>Watchman <br />size (mm)</b></div>
                    <div className="grid-block align-center shrink item">{wat[0]}</div>                
                </div>
            </div>

        );
    }
}