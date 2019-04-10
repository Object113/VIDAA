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

var THREE = require('three');

export function obtainBlobUrl(blob) {

    var file = blob[0];

    var blob_url = window.URL.createObjectURL(file);
    return blob_url;

}
export function load_centreline2(url_center_line, mesh,callback) {
    var loader = new THREE.VTKLoader();
    loader.load(url_center_line, function (geometry) {
        var all_vectors = create_line(geometry);
        callback(all_vectors);
    })
}

function create_line(geometry) {

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
    var all_vectors = calculate_landing_point(centreline_points_obj);
    var data = {};
    data["all_vectors"] = all_vectors;
    data["centreline_points_obj"] = centreline_points_obj;
    return data;
}



function calculate_landing_point(centreline_points_obj) {

    var geo_distance = [];

    for (var i = 0; i < centreline_points_obj.length; i++) {
        geo_distance[i] = 0;
    }
    for (var i = centreline_points_obj.length - 2; i >= 0; i--) {
        // Distancias respecto al punto central del ostium (GEODESICA)
        geo_distance[i] = geo_distance[i + 1] + (Math.sqrt(Math.pow(centreline_points_obj[i].x - centreline_points_obj[i + 1].x, 2) + Math.pow(centreline_points_obj[i].y - centreline_points_obj[i + 1].y, 2) + Math.pow(centreline_points_obj[i].z - centreline_points_obj[i + 1].z, 2)));
    }

    // Vectors from ostium point to the rest of the points
    var all_vectors = [];

    for (var i = centreline_points_obj.length - 1; i >= 0; i--) {
        var vector = new THREE.Vector3();
        vector.x = centreline_points_obj[centreline_points_obj.length-1].x-centreline_points_obj[i].x;
        vector.y = centreline_points_obj[centreline_points_obj.length-1].y-centreline_points_obj[i].y;
        vector.z = centreline_points_obj[centreline_points_obj.length-1].z-centreline_points_obj[i].z;        
        vector.normalize();      
        all_vectors[i] = vector;
    }

    // Vectors from all the points to the last point of the line, distal part of the LAA
    var all_vectors2 = [];
    for (var i = centreline_points_obj.length - 1; i >= 0; i--) {
        var vector = new THREE.Vector3();
        vector.x = centreline_points_obj[0].x-centreline_points_obj[i].x;
        vector.y = centreline_points_obj[0].y-centreline_points_obj[i].y;
        vector.z = centreline_points_obj[0].z-centreline_points_obj[i].z;        
        vector.normalize();   
        all_vectors2[i] = vector;
    }
 
    return all_vectors;
};

