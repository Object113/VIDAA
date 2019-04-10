var THREE = require('three');


export function acquire_LAA(contours, meshLAA, mesh, boxcenterLA, device_selection_data, scene) {
    //console.log(contours[0].contour);
    var ostium = contours[0].contour;

    // get all the LAA
    var LApoints_original = meshLAA.geometry.vertices;
    var LApoints = [];

    // Transform points
    for (var i = 0; i < LApoints_original.length; i++) {
        var vector = new THREE.Vector3();
        vector.x = LApoints_original[i].x - boxcenterLA.x;
        vector.y = LApoints_original[i].y - boxcenterLA.y;
        vector.z = LApoints_original[i].z - boxcenterLA.z;
        vector.applyQuaternion(mesh.quaternion);
        LApoints.push(vector);

    }

    var plane_origin = device_selection_data.first_point;

    var closepoints = new THREE.Geometry();;
    for (var i = 0; i < LApoints.length; i++) {
        for (var j = 0; j < ostium.length; j++) {
            // calculate distances
            var distance = Math.sqrt(Math.pow(LApoints[i].x - ostium[j].x, 2) + Math.pow(LApoints[i].y - ostium[j].y, 2) + Math.pow(LApoints[i].z - ostium[j].z, 2));
            if (distance < 40) {

                // calculate directed distance in x
                var x = LApoints[i].x - ostium[j].x;
                var y = LApoints[i].y - ostium[j].y;
                var z = LApoints[i].z - ostium[j].z;

                // Depending on the plane origin --> push points to array
                if (plane_origin.x >= 0 && plane_origin.y >= 0 && plane_origin.z >= 0) {
                    if (x >= 0 && y >= 0 && z >= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x <= 0 && plane_origin.y <= 0 && plane_origin.z <= 0) {
                    if (x <= 0 && y <= 0 && z <= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x >= 0 && plane_origin.y <= 0 && plane_origin.z <= 0) {
                    if (x >= 0 && y <= 0 && z <= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x >= 0 && plane_origin.y >= 0 && plane_origin.z <= 0) {
                    if (x >= 0 && y >= 0 && z <= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x >= 0 && plane_origin.y <= 0 && plane_origin.z >= 0) {
                    if (x >= 0 && y <= 0 && z >= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x <= 0 && plane_origin.y <= 0 && plane_origin.z >= 0) {
                    if (x <= 0 && y <= 0 && z >= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x <= 0 && plane_origin.y >= 0 && plane_origin.z <= 0) {
                    if (x <= 0 && y >= 0 && z <= 0) {
                        closepoints.vertices.push(LApoints[i]);
                    }
                }

                if (plane_origin.x <= 0 && plane_origin.y >= 0 && plane_origin.z >= 0) {
                    if (x <= 0 && y >= 0 && z >= 0) {
                        closepoints.vertices.push(LApoints[i]);

                    }
                }

            }
            closepoints.vertices.push(ostium[j]);

        }
    }

    /* var pointsMaterial = new THREE.PointsMaterial({
         size: 5,
         color: "red"
     });
     var points = new THREE.Points(closepoints, pointsMaterial);
     scene.add(points);
     
     var material = new THREE.LineBasicMaterial( { color: "white"} );
     var line = new THREE.Line( closepoints, material );
     //scene.add(line);*/
    return closepoints;
}

export function contour_acquisition(pointsGeo, contours, scene) {

    var contour = contours[0].contour;
    var closepoints = new THREE.Geometry();

    var points = pointsGeo.vertices;

    for (var i = 0; i < contour.length; i++) {
        for (var j = 0; j < points.length; j++) {

            // calculate distances
            var distance = Math.sqrt(Math.pow(contour[i].x - points[j].x, 2) + Math.pow(contour[i].y - points[j].y, 2) + Math.pow(contour[i].z - points[j].z, 2));

            if (distance >= 0 && distance < 1) {
                closepoints.vertices.push(contour[i]);
            }
        }
    }
    var new_points = new THREE.Geometry();
    for (var i = 0; i < closepoints.vertices.length; i++) {
        if (closepoints.vertices[i] !== closepoints.vertices[i - 1]) {
            new_points.vertices.push(closepoints.vertices[i]);
        }
    }

    var pointsMaterial = new THREE.PointsMaterial({
        size: 2,
        color: "red"
    });
    // Connect first and last point
    var new_points2 = new THREE.Geometry();
    new_points2.vertices.push(new_points.vertices[new_points.vertices.length-1]);
    new_points2.vertices.push(new_points.vertices[0]);

    // get more points
    var divisions = Math.round(10 * new_points2.vertices.length);
    var spline = new THREE.CatmullRomCurve3(new_points2.vertices);

    var positions2 = new THREE.Geometry;
    
    for (var i = 0, l = divisions; i < l; i++) {
        var point = spline.getPoint(i / l);
        positions2.vertices.push(point); 
    }
    // connect previous point with all points of the contour
    var new_points3 = new THREE.Geometry();
    new_points3.vertices.push(positions2.vertices);
    new_points3.vertices.push(new_points.vertices);
    
    var new_points4 = new THREE.Geometry();
    
    for(var i=0;i<new_points3.vertices.length;i++){
        var points = new_points3.vertices[i];
        for (var j=0;j<points.length;j++){
            new_points4.vertices.push(points[j]);
        }
    }
    
    var divisions = Math.round(10 * new_points4.vertices.length);
    var spline = new THREE.CatmullRomCurve3(new_points4.vertices);

    var positions = new THREE.Geometry();
    
    for (var i = 0, l = divisions; i < l; i++) {
        var point = spline.getPoint(i / l);
        positions.vertices.push(point); 
    }
    
    // add points
    var points = new THREE.Points(positions, pointsMaterial);
    scene.add(points);


    // add lines
    var material = new THREE.LineBasicMaterial({ color: "red", linewidth: 2 });
    var line = new THREE.Line(positions, material);
    //line.visible=false;
    scene.add(line);

    var data = {};
    data["points"] = points;
    data["lines"] = line;
    data["diameters"] = calculate_diameters(points.geometry.vertices);
    return data;

}

function calculate_diameters(contour_coordinates) {
   
    var all_distances = [];
    // Calculate all distances
    for (var i = 0; i < contour_coordinates.length; i++) {
        for (var j = 1; j < contour_coordinates.length; j++) {
            var distance = Math.sqrt((Math.pow(contour_coordinates[i].x - contour_coordinates[j].x, 2)) + (Math.pow(contour_coordinates[i].y - contour_coordinates[j].y, 2)) + Math.pow(contour_coordinates[i].z - contour_coordinates[j].z, 2));
            var vector = [distance, i, j];
            all_distances.push(vector);
        }
    }
    var D1;
    // Calculate D1 - maximal distance between two points
    for (var i = 1; i < all_distances.length; i++) {
        if (all_distances[i][0] > all_distances[i - 1][0]) {
            D1 = all_distances[i];
        }
    }
    // coordenates of the first point of D1
    var A = new THREE.Vector3(contour_coordinates[D1[1]].x, contour_coordinates[D1[1]].y, contour_coordinates[D1[1]].z)
    // coordinate of the second point of D1
    var B = new THREE.Vector3(contour_coordinates[D1[2]].x, contour_coordinates[D1[2]].y, contour_coordinates[D1[2]].z)

    var line = new THREE.Line3(A, B);
    var line_D1 = new THREE.LineGeometry(line, new THREE.LineBasicMaterial({
        color: "green"
    }));

    // mid point between A and B
    var midpoint = new THREE.Vector3;
    midpoint.x = (A.x + B.x) / 2;
    midpoint.y = (A.y + B.y) / 2;
    midpoint.z = (A.z + B.z) / 2;
    
    // Minimum radius calculation
    var min_distances = [];
    for (var i = 0; i < contour_coordinates.length; i++) {
        var distance = Math.sqrt((Math.pow(contour_coordinates[i].x - midpoint.x, 2)) + (Math.pow(contour_coordinates[i].y - midpoint.y, 2)) + Math.pow(contour_coordinates[i].z - midpoint.z, 2));
        var vector = [distance, i];
        min_distances.push(vector);
    }

    // Calculate minimum distance
    var R_min = min_distances[0];
    for (var i = 1; i < min_distances.length; i++) {
        if (i !== D1[1] && i !== D1[2]) {
            if (min_distances[i][0] < R_min[0]) {
                R_min = min_distances[i];
            } 
        }
    }

    // Minimum diameter calculation from the minimum radius
    // Calculate vector from midpoint to the end of R_min
    var vecA = new THREE.Vector3();
    vecA.x = midpoint.x - contour_coordinates[R_min[1]].x;
    vecA.y = midpoint.y - contour_coordinates[R_min[1]].y;
    vecA.z = midpoint.z - contour_coordinates[R_min[1]].z;
    vecA.normalize();
    var module_vecA = Math.sqrt(Math.pow(vecA.x, 2) + Math.pow(vecA.y, 2) + Math.pow(vecA.z, 2));
    // Calculate vectors from all points to the midpoint
    var all_vectors = [];
    var complementarian_vector;
    for (var i = 0; i < contour_coordinates.length; i++) {
        var vecB = new THREE.Vector3();
        vecB.x = midpoint.x - contour_coordinates[i].x;
        vecB.y = midpoint.y - contour_coordinates[i].y;
        vecB.z = midpoint.z - contour_coordinates[i].z;
        vecB.normalize();
        all_vectors.push(vecB);
        // Calculate angles from vecA to vecB
        var product = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
        var module_vecB = Math.sqrt(Math.pow(vecB.x, 2) + Math.pow(vecB.y, 2) + Math.pow(vecB.z, 2));
        var angle = Math.acos(product / (module_vecA * module_vecB));
        var angle_deg = angle*180/Math.PI;
        
        // See if the angle is near to 180º
        if (angle_deg >= 180 - 1 && angle_deg <= 180  + 1) {
       
            complementarian_vector = i;
        }

    }
    // Calculate minimal distance
    var CD_x = contour_coordinates[R_min[1]].x - contour_coordinates[complementarian_vector].x;
    var CD_y = contour_coordinates[R_min[1]].y - contour_coordinates[complementarian_vector].y;
    var CD_z = contour_coordinates[R_min[1]].z - contour_coordinates[complementarian_vector].z;

    // Distance
    var D2 = Math.sqrt(Math.pow(CD_x, 2) + Math.pow(CD_y, 2) + Math.pow(CD_z, 2));

    var D2_vec = [D2, R_min[1], complementarian_vector];
    // Export data
    var data = {};
    data["D1"] = D1;
    data["D2"] = D2_vec;
    data["line_D1"] = line_D1;
    data["R_min"] = R_min;
    return data;
}