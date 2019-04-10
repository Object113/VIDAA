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