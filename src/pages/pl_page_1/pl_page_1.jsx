import React, { Component } from 'react';

import { PlComponentViewer } from './../../components/pl_component_viewer/pl_component_viewer';

export class PlPage1 extends Component {

    render() {

        return (
            <div className="grid-block pl_page1">
                <PlComponentViewer />
            </div>
        );
    }
}