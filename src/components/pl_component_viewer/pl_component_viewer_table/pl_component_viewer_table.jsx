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