import { isObjectEmpty, isObjectAnArray } from './../../../modules/pl_module_object';

var THREE = require('three');
const PCA = require('ml-pca');


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

function get_max_abs_value_x_contours(countours) {

    var max_value;

    for (var i = 0; i < countours.length; i++) {

        var contour = countours[i].pca_array_output;

        if (i === 0) {

            max_value = get_max_abs_value_x(contour);

        } else {

            if (max_value < get_max_abs_value_x(contour)) {

                max_value = get_max_abs_value_x(contour);
            }
        }
    }

    return max_value;
}

function get_max_abs_value_y_contours(countours) {

    var max_value;

    for (var i = 0; i < countours.length; i++) {

        var contour = countours[i].pca_array_output;

        if (i === 0) {

            max_value = get_max_abs_value_y(contour);

        } else {

            if (max_value < get_max_abs_value_y(contour)) {

                max_value = get_max_abs_value_y(contour);
            }
        }
    }

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
    var canvas_width = canvas.clientWidth - 50;
    var canvas_height = canvas.clientHeight - 50;

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

//function draw_canvas(canvas_points, color, D1, R_min, D2) {
function draw_canvas(canvas_points, color) {
    var c = document.getElementById("my_canvas");
    var ctx = c.getContext("2d");
 
    ctx.clearRect(0, 0, c.width, c.height);
    
    
    //Draw line
    ctx.beginPath();

    ctx.strokeStyle = "red";
    // ctx.fillStyle="gray";

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
    ctx.fill();

    // Draw maximal diameter line

    /*  ctx.beginPath();
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
  
      console.log(D2);
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
  
      // Mid point between the start and the end of the maximal diameter
      /*var midpoint = [];
      midpoint[0] = (canvas_points[D1[1]][0] + canvas_points[D1[2]][0]) / 2;
      midpoint[1] = (canvas_points[D1[1]][1] + canvas_points[D1[2]][1]) / 2;
      
      // Draw midpoint
      ctx.fillStyle = "blue";
      ctx.fillRect(midpoint[0],midpoint[1],7,7);*/

    //Draw points
    ctx.fillStyle = "red";

    for (var i = 0; i < canvas_points.length; i++) {

        var point = canvas_points[i];
        ctx.fillRect(point[0], point[1], 4, 4);
    }

}

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
}

//export function create_canvas(contours, D1, R_min, D2) {

export function create_canvas(contours) {
    var i;
    var contour;

    if (!isObjectEmpty(contours)) {

        if (isObjectAnArray(contours)) {

            for (i = 0; i < contours.length; i++) {

                contour = contours[i];
                contour["pca_array_input"] = convert_three_array_to_pca_array(contour.contour);

            }

            //Creating rotation matrix
            var first_contour = contours[0].pca_array_input;
            var pca = new PCA(first_contour);

            //3D to 2D conversion
            for (i = 0; i < contours.length; i++) {

                contour = contours[i];
                contour["pca_array_output"] = pca.predict(contour.pca_array_input);

            }

            //Computing max values bounding box in pca_output
            var max_abs_value_x = get_max_abs_value_x_contours(contours);
            var max_abs_value_y = get_max_abs_value_y_contours(contours);

            var max_abs_value_x_translated = max_abs_value_x * 2;
            var max_abs_value_y_translated = max_abs_value_y * 2;


            //Drawing contours in canvas
            for (i = 0; i < contours.length; i++) {

                var canvas_coordinates = translate_coordinates_to_canvas(contours[i].pca_array_output, max_abs_value_x, max_abs_value_y);
                var canvas_coordinates_scaled = scale_points_to_canvas_size(canvas_coordinates, max_abs_value_x_translated, max_abs_value_y_translated);
                //draw_canvas(canvas_coordinates_scaled, contours[i].color, D1, R_min, D2);
                draw_canvas(canvas_coordinates_scaled, contours[i].color);

            }

        }

    }

}