import VTKLoader from './../../../libs/VTKLoader'

var THREE = require('three');

export function obtainBlobUrl(blob) {

    var file = blob[0];

    var blob_url = window.URL.createObjectURL(file);
    return blob_url;

}

export function load_centreline(url_center_line, measurements, callback) {
    //delete3DOBJ(scene, "centreline");
    var loader = new THREE.VTKLoader();
    loader.load(url_center_line, function (geometry) {
        var diameters = create_line(geometry, measurements);
        callback(diameters);

    })
}

export function create_line(geometry, measurements) {

    var centreline_points_obj = geometry.vertices;
    var centreline_length = centreline_points_obj.length;
    var centreline_points_array = [];

    for (var i = 0; i < centreline_length; i++) {
        centreline_points_array.push(new THREE.Vector3(centreline_points_obj[i].x, centreline_points_obj[i].y, centreline_points_obj[i].z));
    }

    var divisions = Math.round(1 * centreline_length);
    var spline = new THREE.CatmullRomCurve3(centreline_points_array);

    var positions = [];

    for (var i = 0, l = divisions; i < l; i++) {
        var point = spline.getPoint(i / l);
        positions.push(point.x, point.y, point.z);

    }
    var diameters = calculate_landing_point(centreline_length, centreline_points_obj, 10, 13, measurements);

    return diameters;
}



export function calculate_landing_point(centreline_length, centreline_points_obj, h1, h2, measurements) {
    var distances = [];
    var positions_10_13 = [];
    var geo_positions_10_13 = [];
    var arrowHelper;
    for (var i = centreline_points_obj.length - 1; i >= 0; i--) {
        // Distancias respecto al punto central del ostium (EUCLIDEA)
        distances[i] = (Math.sqrt(Math.pow(centreline_points_obj[i].x - centreline_points_obj[centreline_points_obj.length - 1].x, 2) + Math.pow(centreline_points_obj[i].y - centreline_points_obj[centreline_points_obj.length - 1].y, 2) + Math.pow(centreline_points_obj[i].z - centreline_points_obj[centreline_points_obj.length - 1].z, 2)));
    }

    var geo_distance = [];

    for (var i = 0; i < centreline_points_obj.length; i++) {
        geo_distance[i] = 0;
    }
    for (var i = centreline_points_obj.length - 2; i >= 0; i--) {
        // Distancias respecto al punto central del ostium (GEODESICA)
        geo_distance[i] = geo_distance[i + 1] + (Math.sqrt(Math.pow(centreline_points_obj[i].x - centreline_points_obj[i + 1].x, 2) + Math.pow(centreline_points_obj[i].y - centreline_points_obj[i + 1].y, 2) + Math.pow(centreline_points_obj[i].z - centreline_points_obj[i + 1].z, 2)));
    }

    // Calculo de landing zone
    // posicion de puntos a una altura de 10-13 mm del ostium, calculado desde la centreline (EUCLIDEA)
    for (var i = centreline_points_obj.length - 1; i >= 0; i--) {
        if (distances[i] >= h1 && distances[i] <= h2) {
            positions_10_13.push(i);
        }
    }

    // posicion de puntos a una altura de 10-13 mm del ostium, calculado desde la centreline (GEODESICA)

    for (var i = centreline_points_obj.length - 1; i >= 0; i--) {
        if (geo_distance[i] >= h1 && geo_distance[i] <= h2) {
            geo_positions_10_13.push(i);
        }
    }

    var i = measurements.length - geo_positions_10_13[0] - 1;
    var D1 = measurements[i].d1;
    var D2 = measurements[i].d2;

    var diameters = {};
    diameters["D1"] = Math.round(D1 * 100) / 100;
    diameters["D2"] = Math.round(D2 * 100) / 100;
    diameters["geo_dist"] = geo_distance;
    diameters["CL_points"] = centreline_points_obj;
    var ampl_selected = ampl_selection(D1, D2);
    diameters["ampl"] = ampl_selected;
    var wat_selected = wat_device_selection(D1);
    diameters["wat"] = wat_selected;
    return diameters;

}


function ampl_selection(D1, D2) {
    var D_mean = ((D1 + D2) / 2 + 2);
    var ampl_AMULET = [16, 18, 20, 22, 25, 28, 31, 34];

    var ampl_selected = [];
    // Amplatzer Selection
    var cont = 0;
    for (var i = 0; i <= ampl_AMULET.length - 1; i++) {
        if (D_mean <= ampl_AMULET[i]) {
            ampl_selected.push(i);
            if (i == ampl_AMULET.length - 1) {
                ampl_selected.push(i - 1);

            }
            if (i == 0) {
                ampl_selected.push(i + 1);

            }
        }
        if (D_mean > ampl_AMULET[ampl_AMULET.length - 1]) {
            alert("Amplatzer AMULET Implantation - Not recommended");
        }
        cont++;
    }
    ampl_selected = ampl_selected.filter(function (elem, pos) {
        return ampl_selected.indexOf(elem) == pos;
    });

    ampl_selected.sort();

    // First amplatzer AMULET selected
    ampl_selected = [ampl_AMULET[ampl_selected[0]]];


    return ampl_selected;
};


function wat_device_selection(D1) {

    
    var wat_selected = [];

    if (D1 >= 16.8 && D1 <= 19.3) {
        wat_selected.push(21);
        
    }
    if (D1 >= 19.2 && D1 <= 22.1) {
        wat_selected.push(24);
        
    }
    if (D1 >= 21.6 && D1 <= 24.8) {
        wat_selected.push(27);
       
    }
    if (D1 >= 24 && D1 <= 27.6) {
        wat_selected.push(30);
        
    }
    if (D1 >= 26.4 && D1 <= 30.4) {
        wat_selected.push(33);
        
    }
    if (D1 > 30.4) {
        alert("Watchman Implantation - Not recommended");
    }
    return wat_selected;

}

