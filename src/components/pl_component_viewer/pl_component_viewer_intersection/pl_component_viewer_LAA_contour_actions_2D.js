import { isObjectEmpty, isObjectAnArray } from './../../../modules/pl_module_object';

var THREE = require('three');
const PCA = require('ml-pca');

function convert_three_array_to_pca_array(three_array) {

    var pca_array = [];

    for (var i = 0; i < three_array.length; i++) {

        var point = three_array[i];

        var array = [];
        array.push(point.x);
        array.push(point.y);
        array.push(point.z);

        pca_array.push(array);
    }

    return pca_array;
};
function get_max_abs_value_x_contours(countour) {
    var max_value;
    max_value = get_max_abs_value_x(countour);
    return max_value;
}
function get_max_abs_value_x(matrix) {

    var max_value;

    for (var i = 0; i < matrix.length; i++) {

        var point = matrix[i];

        if (i === 0) {

            max_value = Math.abs(point[0]);

        } else {

            if (max_value < Math.abs(point[0])) {

                max_value = Math.abs(point[0]);
            }
        }
    }

    return max_value;
}

function get_max_abs_value_y(matrix) {

    var max_value;

    for (var i = 0; i < matrix.length; i++) {

        var point = matrix[i];

        if (i === 0) {

            max_value = Math.abs(point[1]);

        } else {

            if (max_value < Math.abs(point[1])) {

                max_value = Math.abs(point[1]);
            }
        }
    }

    return max_value;
}
function get_max_abs_value_y_contours(countour) {

    var max_value;
    max_value = get_max_abs_value_y(countour);
    return max_value;
}
function translate_coordinates_to_canvas(dataset, max_x, max_y) {

    var canvas_dataset = [];

    for (var i = 0; i < dataset.length; i++) {

        var point = dataset[i];

        var array = [];

        var x = point[0] + max_x;
        var y = point[1] + max_y;

        array.push(x);
        array.push(y);

        canvas_dataset.push(array);

    }

    return canvas_dataset;
}

function scale_points_to_canvas_size(dataset, max_abs_value_x, max_abs_value_y) {

    var canvas = document.getElementById("my_canvas");
    var canvas_width = canvas.clientWidth - 60;
    var canvas_height = canvas.clientHeight - 60;

    var canvas_dataset = [];

    for (var i = 0; i < dataset.length; i++) {

        var array = [];
        var point = dataset[i];
        var x = (point[0] * canvas_width) / max_abs_value_x;
        var y = (point[1] * canvas_height) / max_abs_value_y;
        array.push(x);
        array.push(y);
        canvas_dataset.push(array);
    }

    return canvas_dataset;
}

function draw_canvas(canvas_points, D1, D2) {
    var c = document.getElementById("my_canvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    //Draw points
    ctx.fillStyle = "red";

    for (var i = 0; i < canvas_points.length; i++) {

        var point = canvas_points[i];
        ctx.fillRect(point[0], point[1], 2, 2);
    }
    //Draw line
    ctx.beginPath();

    ctx.strokeStyle = "red";

    for (var i = 0; i < canvas_points.length; i++) {

        var point = canvas_points[i];

        if (i === 0) {

            ctx.moveTo(point[0], point[1]);

        } else {

            ctx.lineTo(point[0], point[1]);
        }
    }

    ctx.closePath(); // draws last line of the triangle
    ctx.stroke();
   
    // Draw maximal diameter line
    ctx.beginPath();
    ctx.strokeStyle = "white";

    for (var i = 1; i < 3; i++) {
        var point = canvas_points[D1[i]];
        if (i === 1) {
            ctx.moveTo(point[0], point[1]);
        } else {
            ctx.lineTo(point[0], point[1]);
        }

    }
    ctx.closePath();
    ctx.stroke();

    // Draw minimal diameter line
    ctx.beginPath();
    ctx.strokeStyle = "green";

    for (var i = 1; i < 3; i++) {
        var point = canvas_points[D2[i]];
        if (i === 1) {
            ctx.moveTo(point[0], point[1]);
        } else {
            ctx.lineTo(point[0], point[1]);
        }

    }
    ctx.closePath();
    ctx.stroke();

    // D1 value
    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    var D1_value = D1[0];
    D1_value = D1_value.toFixed(2); 
    var x1 = canvas_points[D1[1]][0];
    var y1 = canvas_points[D1[1]][1];
    
    var x2 = canvas_points[D1[2]][0];
    var y2 = canvas_points[D1[2]][1];

    var x = x1+x2/2;
    var y = y1+y2/2;
    ctx.fillText(D1_value, x, y);

    // D2 value
    ctx.font = "14px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";

    var D2_value = D2[0];

    D2_value = D2_value.toFixed(2); 
    var x3 = canvas_points[D2[1]][0];
    var y3 = canvas_points[D2[1]][1];

    var x4 = canvas_points[D2[2]][0];
    var y4 = canvas_points[D2[2]][1];

    var x_D2 = x3+x4/2;
    var y_D2 = y3+y4/2;
    
    ctx.fillText(D2_value, x_D2, y_D2);



}

export function create_canvas(points, D1, D2) {
    var PCA_array = convert_three_array_to_pca_array(points);

    // create rotation matrix
    var pca = new PCA(PCA_array);

    //3D to 2D
    var PCA_points = pca.predict(PCA_array);

    //Computing max values bounding box in pca_output
    var max_abs_value_x = get_max_abs_value_x_contours(PCA_points);
    var max_abs_value_y = get_max_abs_value_y_contours(PCA_points);

    var max_abs_value_x_translated = max_abs_value_x * 2;
    var max_abs_value_y_translated = max_abs_value_y * 2;


    var canvas_coordinates = translate_coordinates_to_canvas(PCA_points, max_abs_value_x, max_abs_value_y);
    var canvas_coordinates_scaled = scale_points_to_canvas_size(canvas_coordinates, max_abs_value_x_translated, max_abs_value_y_translated);
    draw_canvas(canvas_coordinates_scaled, D1, D2);
    //draw_canvas(canvas_coordinates_scaled);


}