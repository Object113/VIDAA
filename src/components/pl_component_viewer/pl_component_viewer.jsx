/*
# Rocket viewer is (c) BCNMedTech, UNIVERSITAT POMPEU FABRA
#
# Rocket viewer is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# Rocket viewer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Authors:
# Carlos Yagüe Méndez
# María del Pilar García
# Daniele Pezzatini
# Contributors: 
# Sergio Sánchez Martínez
*/

import React, { Component } from 'react';

import { PlComponentViewerEmpty } from './pl_component_viewer_empty/pl_component_viewer_empty';
import { PlComponentViewerLoaded } from './pl_component_viewer_loaded/pl_component_viewer_loaded';
import { blob_getNumberOfFiles } from './../../modules/pl_module_blob';
import { import_data_to_app } from './pl_component_viewer_action';

export class PlComponentViewer extends Component {

    constructor() {
        super();

        this.state = {
            mesh: false,
            center_line: false,
            measurements: false,
            ampl: false,
            wat: false,
            D1: false,
            D2: false,
        };

        this._onDragEnter = this._onDragEnter.bind(this);
        this._onDragLeave = this._onDragLeave.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
    }

    componentDidMount() {

        window.addEventListener('mouseup', this._onDragLeave);
        window.addEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        window.addEventListener('drop', this._onDrop);
        document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this._onDragLeave);
        window.removeEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        document.getElementById('dragbox').removeEventListener('dragleave', this._onDragLeave);
        window.removeEventListener('drop', this._onDrop);
    }

    _onDragEnter(e) {

        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDragOver(e) {

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    _onDragLeave(e) {

        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    _onDrop(e) {

        e.preventDefault();

        let blob = e;

        if (blob_getNumberOfFiles(blob) === 1) {

            var file = blob.dataTransfer.files;
            var file_name = file[0].name;

            var elements_file_name = file_name.split(".");
            var extension = elements_file_name[elements_file_name.length - 1];


            if (extension === "stl") {

                if (this.state.mesh === false) {
                    this.setState({
                        mesh: file
                    });
                }


            } else if (extension === "vtk") {

                if (this.state.center_line === false) {
                    this.setState({
                        center_line: file
                    })
                }


            } else if (extension === "xlsx") {

                if (this.state.measurements === false) {

                    var myComponent = this;

                    import_data_to_app(file[0], function (result) {

                        if ("hoja1" in result) {

                            myComponent.setState({
                                measurements: result["hoja1"]

                            });

                        }

                    });
                }
            }
        }

    }

    renderViewer() {

        var mesh = this.state.mesh;
        var center_line = this.state.center_line;
        var measurements = this.state.measurements;

        if (mesh === false || center_line === false || measurements === false) {
           
           return (<PlComponentViewerEmpty mesh={mesh} center_line={center_line} measurements={measurements} />);
        } else {
          
            return (<PlComponentViewerLoaded mesh={mesh} center_line={center_line} measurements={measurements} />);
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