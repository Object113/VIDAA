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