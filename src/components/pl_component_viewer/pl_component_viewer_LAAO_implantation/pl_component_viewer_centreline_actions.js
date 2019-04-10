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

import LineSegmentsGeometry from "./../../../libs/LineSegmentsGeometry";
import LineGeometry from "./../../../libs/LineGeometry";
import LineSegments2 from "./../../../libs/LineSegments2";
import Line2 from "./../../../libs/Line2";
import LineMaterial from "./../../../libs/LineMaterial";

var THREE = require('three');

export function create_line(mesh,boxcenterLA, geometry) {
    var centreline_points_obj = geometry.vertices;
    var centreline_length = centreline_points_obj.length;
    var centreline_points_array = [];

    for (var i = 0; i < centreline_length; i++) {
        centreline_points_array.push(new THREE.Vector3(centreline_points_obj[i].x, centreline_points_obj[i].y, centreline_points_obj[i].z));
    }


    var divisions = Math.round(1 * centreline_length);
    var spline = new THREE.CatmullRomCurve3(centreline_points_array);

    var positions = [];
    var colors = [];
    var color = new THREE.Color();

    for (var i = 0, l = divisions; i < l; i++) {
        var point = spline.getPoint(i / l);
        positions.push(point.x, point.y, point.z);

        color.setHSL(1, 1.0, 1);
        colors.push(color.r, color.g, color.b);
    }

    var geometry_line = new THREE.LineGeometry();
    geometry_line.setPositions(positions);
    geometry_line.setColors(colors);

    var matLine = new THREE.LineMaterial({
        color: 0xffffff,
        linewidth: 0.003, // in pixels
        vertexColors: THREE.VertexColors,
        dashed: false
    });

    var centreline = new THREE.Line2(geometry_line, matLine);
    centreline.scale.set(1, 1, 1);

    var positioned_centreline = position_centreline(mesh,boxcenterLA, centreline, centreline_length,centreline_points_obj);

    var data = {}

    data["points"]=centreline_points_obj;
    data["positioned_center_line"]=positioned_centreline;
    
    return data;

}

function position_centreline(mesh,boxcenterLA, centreline, centreline_length,centreline_points_obj){
    var centre_point_coord = Math.round(centreline_length / 2);
    var centre_point = new THREE.Vector3(centreline_points_obj[centre_point_coord].x, centreline_points_obj[centre_point_coord].y, centreline_points_obj[centre_point_coord].z);

    // Bounding box
    var box = new THREE.Box3().setFromObject(centreline);

    // centro de la mesh
    var boxcenter = box.getCenter();
    var boxsize = box.getSize();
   
    var origin_scene = new THREE.Matrix4();
    origin_scene.set(1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);

    centreline.applyMatrix(origin_scene);

    var origin_centreline = new THREE.Matrix4();
    origin_centreline.set(-1, 0, 0, centre_point.x,
        0, -1, 0, centre_point.y,
        0, 0, 1, -centre_point.z,
        0, 0, 0, 1);

    centreline.applyMatrix(origin_centreline);

    var origin_LA = new THREE.Matrix4();
    origin_LA.set(1, 0, 0, boxcenterLA.x - centre_point.x,
        0, 1, 0, boxcenterLA.y - centre_point.y,
        0, 0, 1, -boxcenterLA.z + centre_point.z,
        0, 0, 0, 1);
    centreline.applyMatrix(origin_LA);
    var quaternion_centreline = new THREE.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
    centreline.applyQuaternion(quaternion_centreline);

    centreline.rotation.x = mesh.rotation.x;
    centreline.rotation.y = mesh.rotation.y;
    centreline.rotation.z = mesh.rotation.z;

    var data = {}
    data["origin_la"]=origin_LA;
    data["center_line"]=centreline;

    return data;
}

export function calculate_landing_point(centreline_length,centreline_points_obj,boxcenterLA,mesh,scene,origin_LA,h1,h2) {
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

    // vector normal para crear plano
    var vector = new THREE.Vector3();
    // vector desde el primer punto a 10 mm hasta el primero a 13 mm
    vector.x = centreline_points_obj[geo_positions_10_13[0]].x - centreline_points_obj[geo_positions_10_13[5]].x;
    vector.y = centreline_points_obj[geo_positions_10_13[0]].y - centreline_points_obj[geo_positions_10_13[5]].y;
    vector.z = centreline_points_obj[geo_positions_10_13[0]].z - centreline_points_obj[geo_positions_10_13[5]].z;

    // modulo vector
    var modulo = Math.sqrt(Math.pow(vector.x, 2), Math.pow(vector.y, 2), Math.pow(vector.z, 2));

    // calculamos vector normal
    var normal_vector = new THREE.Vector3(vector.x / modulo, vector.y / modulo, vector.z / modulo);

    var coord_x = centreline_points_obj[geo_positions_10_13[0]].x - boxcenterLA.x;
    var coord_y = centreline_points_obj[geo_positions_10_13[0]].y - boxcenterLA.y;
    var coord_z = centreline_points_obj[geo_positions_10_13[0]].z - boxcenterLA.z;

    // Position for simulations;
    var sim_point = new THREE.Vector3(centreline_points_obj[positions_10_13[positions_10_13.length - 1]].x, centreline_points_obj[positions_10_13[positions_10_13.length - 1]].y, centreline_points_obj[positions_10_13[positions_10_13.length - 1]].z);
    
    // Arrow Helpers
    var vectororigin = new THREE.Vector3(coord_x, coord_y, coord_z);

    var quaternion_centreline = new THREE.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
    vectororigin.applyQuaternion(quaternion_centreline);
    var length = 30;
    var hex = 0xd6eaf8;

    arrowHelper = new THREE.ArrowHelper(vector, vectororigin, length, hex);
   //scene.add(arrowHelper);

    // Esfera en el punto a 10 mm de la centreline
    var landing_point = new THREE.SphereGeometry();

    landing_point.radius = 5;
    var lp_material = new THREE.MeshBasicMaterial({ color: 0xA52A2A });
    var lp_mesh = new THREE.Mesh(landing_point, lp_material);
    lp_mesh.position.set(vectororigin.x, vectororigin.y, vectororigin.z);
    var data_landing = {};
    data_landing["lp_coord"] = geo_positions_10_13[0];
    data_landing["landing_point"] = lp_mesh;
    data_landing["arrowHelper"] = arrowHelper;
    data_landing["normal_vector"] = normal_vector;
    data_landing["vector_origin"] = vectororigin;
    return data_landing;
}




