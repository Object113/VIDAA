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

import dat from "./../../../libs/dat.gui.min.js";
import {
    obtainBlobUrl,
    initScene,
    loadStl,
    load_centreline,
    ampl_device_selection,
    wat_device_selection,
    load_ampl_AMULET,
    load_Watchman,
    renderView
} from './pl_component_viewer_LAAO_implantation_actions';

import {
    placeGUI
} from './pl_component_viewer_LAAO_implantation_actions_gui';

export class PlComponentViewerLAAOImplantation extends Component {

    constructor() {
        super()
        this.state = {
            loaded: false,
            ampl: false,
            wat: false
        }
    }

    initstate() {

        this.setState({
            loaded: false
        });
    }

    componentDidMount() {

        var myComponent = this;

        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        var measurements = this.props.measurements;

        console.log("Component did mount");

        initScene(function (scene) {

            var url_mesh = obtainBlobUrl(mesh);

            var url_centreline = obtainBlobUrl(center_line);


            loadStl(scene, url_mesh, function (data) {
                var mesh = data.mesh;
                var boxcenterLA = data.boxcenterLA;

                load_centreline(scene, url_centreline, mesh, boxcenterLA, function (device_selection_data) {

                    var ampl_selected = ampl_device_selection(myComponent, scene, measurements, device_selection_data.ampl);
                    var wat_selected = wat_device_selection(scene, measurements, device_selection_data.wat);

                    var ampl_path = ["./Ampl_std_mesh/9-ACP2-007-016.stl",
                        "./Ampl_std_mesh/9-ACP2-007-018.stl",
                        "./Ampl_std_mesh/9-ACP2-007-020.stl",
                        "./Ampl_std_mesh/9-ACP2-007-022.stl",
                        "./Ampl_std_mesh/9-ACP2-010-025.stl",
                        "./Ampl_std_mesh/9-ACP2-010-028.stl",
                        "./Ampl_std_mesh/9-ACP2-010-031.stl",
                        "./Ampl_std_mesh/9-ACP2-010-034.stl"];

                    var AMPL_gui_data = {};
                    AMPL_gui_data["visibility"] = [];
                    AMPL_gui_data.visibility[0] = {
                        "Ampl. 16": false
                    };
                    AMPL_gui_data.visibility[1] = {
                        "Ampl. 18": false
                    };
                    AMPL_gui_data.visibility[2] = {
                        "Ampl. 20": false
                    };
                    AMPL_gui_data.visibility[3] = {
                        "Ampl. 22": false
                    };
                    AMPL_gui_data.visibility[4] = {
                        "Ampl. 25": false
                    };
                    AMPL_gui_data.visibility[5] = {
                        "Ampl. 28": false
                    };
                    AMPL_gui_data.visibility[6] = {
                        "Ampl. 31": false
                    };
                    AMPL_gui_data.visibility[7] = {
                        "Ampl. 34": false
                    };

                    AMPL_gui_data["text"] = ["Ampl. 16",
                        "Ampl. 18",
                        "Ampl. 20",
                        "Ampl. 22",
                        "Ampl. 25",
                        "Ampl. 28",
                        "Ampl. 31",
                        "Ampl. 34"
                    ];

                    var gui_devices = new dat.GUI();
                    placeGUI(gui_devices);
                    var amplatzer_folder = gui_devices.addFolder('Amplatzer AMULET');
                    var watchman_folder = gui_devices.addFolder('Watchman');


                    var ampl_names = [];
                    for (var i = 0; i <= ampl_selected.length - 1; i++) {
                        ampl_names[i] = AMPL_gui_data.text[ampl_selected[i]];
                    };

                    myComponent.setState({
                        ampl: ampl_names
                    });

                    for (var i = 0; i <= ampl_selected.length - 1; i++) {
                        load_ampl_AMULET(ampl_path[ampl_selected[i]], device_selection_data.ampl, mesh,
                            boxcenterLA, scene, AMPL_gui_data.text[ampl_selected[i]],
                            AMPL_gui_data.visibility[ampl_selected[i]], amplatzer_folder, ampl_names, renderView, function (ampl) {

                            });
                    }

                    var wat_path = ["./Watchman/watchman_21.stl",
                        "./Watchman/watchman_24.stl",
                        "./Watchman/watchman_27.stl",
                        "./Watchman/watchman_30.stl",
                        "./Watchman/watchman_33.stl"];

                    var Wat_gui_data = {};
                    Wat_gui_data["visibility"] = [];
                    Wat_gui_data.visibility[0] = {
                        "Wat. 21": false
                    };
                    Wat_gui_data.visibility[1] = {
                        "Wat. 24": false
                    };
                    Wat_gui_data.visibility[2] = {
                        "Wat. 27": false
                    };
                    Wat_gui_data.visibility[3] = {
                        "Wat. 30": false
                    };
                    Wat_gui_data.visibility[4] = {
                        "Wat. 33": false
                    };

                    Wat_gui_data["text"] = ["Wat. 21",
                        "Wat. 24",
                        "Wat. 27",
                        "Wat. 30",
                        "Wat. 33"
                    ];
                    var wat_names = [];
                    for (var i = 0; i <= wat_selected.length - 1; i++) {
                        wat_names[i] = Wat_gui_data.text[wat_selected[i]];
                    };
                    myComponent.setState({
                        wat: wat_names
                    });
                    for (var i = 0; i <= wat_selected.length - 1; i++) {
                        load_Watchman(wat_path[wat_selected[i]], device_selection_data.wat, mesh, boxcenterLA, scene, Wat_gui_data.text[wat_selected[i]],
                            Wat_gui_data.visibility[wat_selected[i]], watchman_folder, renderView, function (wat) {

                            });
                    };

                });

            })

        });


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
                <a onClick={this.set_action.bind(this, "clipping")}>Clipping View</a>
                <a class="active" onClick={this.set_action.bind(this, "implantation")}>LAAO Implantation</a>
            </div>

        );

    }

    render() {

        return (
            <div className="vertical grid-block pl-component-viewer-LAAO-implantation">
                <div className="grid-block body">
                    <div clasName="grid-block container-viewer" id="container-viewer">
                    </div>
                    <div className="container-gui-menu" id="container-gui-menu" ></div>
                </div>
                <div className="grid-block toolbar shrink">
                    {this.render_toolbar()}
                </div>
            </div>

        );
    }
}