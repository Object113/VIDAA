import dat from "./../../../libs/dat.gui.min.js";
import { drawIntersectionPoints } from "./pl_component_viewer_all_intersections_3D";
import { create_canvas } from './pl_component_viewer_LAA_contour_actions_2D'
import { contour_acquisition } from './pl_component_viewer_LAA_acquisition';
export function create_gui(planes, meshLAA, scene, LAA_points) {

    var gui = new dat.GUI();
    // Slice #
    var params = {
        plane: 0
    }

    var plane = [];
    var previous_contour_lines;
    var previous_contour_points;
    var cont = 0;
    gui.add(params, 'plane', 0, planes.length - 1).name('LAA planes').step(50).onChange(function (value) {

        if (value > planes.length - 1) {

            plane = planes[planes.length - 1];
        }else{
            plane = planes[value];
        }
       
        var contours = drawIntersectionPoints(plane, meshLAA, scene);
        var data = contour_acquisition(LAA_points, contours, scene);
        var LAA_intersected_points = data.points;
        var LAA_intersected_lines = data.lines;
        if (cont > 0) {
            previous_contour_lines.visible = false;
            previous_contour_points.visible = false;
        }
        var point_array = LAA_intersected_points.geometry.vertices;

        var D1 = data.diameters.D1;
        var D2 = data.diameters.D2;

        create_canvas(point_array, D1, D2);

        previous_contour_lines = LAA_intersected_lines;
        previous_contour_points = LAA_intersected_points;
        cont++;

    });

    return gui;

}
export function placeGUI(gui) {
    // we obtain the container in which the created "gui" will be appended
    var container_gui_menu = document.getElementById("container-gui-menu");
    // and we append "gui" to it ("container_gui_menu")
    container_gui_menu.appendChild(gui.domElement);
}