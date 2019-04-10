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

import dat from "./../../../libs/dat.gui.min.js";

export function create_gui(params,mesh,mesh1,render) {

    var gui = new dat.GUI();
    var matselection = gui.addFolder('Material');

    matselection.add(params, 'solidmat').name('Solid').onChange(function (value) {
        
        mesh1.visible = !mesh1.visible;

        render();
    });

    matselection.add(params, 'wireframemat').name('Wireframe').onChange(function (value) {
        
        mesh.visible = !mesh.visible;

        render();
    });

    
    return gui;

}

export function placeGUI(gui) {

    // we obtain the container in which the created "gui" will be appended
    var container_gui_menu = document.getElementById("container-gui-menu");
    // and we append "gui" to it ("container_gui_menu")
    container_gui_menu.appendChild(gui.domElement);
}

export function create_clipping_gui(params,mesh,render,clipPlanes,plane1,plane1_dim,plane2,plane2_dim, plane3,plane3_dim) {
    var gui = new dat.GUI();
    
    var clipping = gui.addFolder ('Clipping Tools');
         clipping.add(params,'clipIntersection').name('Clip Intersection ').onChange(function ( value ) {
             mesh.material.clipIntersection = !value;
           //  mesh1.material.clipIntersection = !value;
            render();
         })
  
         clipping.add( params, 'plane1' ).name( 'Show Red Plane' ).onChange( function ( value ) {
             plane1.visible = value;
             plane1.position.set = (value,0,0);
             render();
         } );
             
         // Slice #
         clipping.add( params, 'planeConstant1', - plane1_dim/2 - 1, plane1_dim/2 ).name( 'Red Slice' ).onChange( function ( value ) {
             
             clipPlanes[0].constant = value;
             
             render();
         });
  
         clipping.add( params, 'plane2' ).name( 'Show Green Plane' ).onChange( function ( value ) {
             plane2.visible = value;
             // para que se mueva el plano
             plane2.position.set = (0,0,value);
             render();
         } );
     
         clipping.add( params, 'planeConstant2', - plane2_dim/2 - 1, plane2_dim/2 ).name( 'Green Slice' ).onChange( function ( value ) {
             clipPlanes[1].constant = value;
             
             render();
         });
  
         clipping.add( params, 'plane3' ).name( 'Show Blue Plane' ).onChange( function ( value ) {
             plane3.visible = value;
             // para que se mueva el plano
             plane3.position.set = (0,value,0);
             render();
         } );
         clipping.add( params, 'planeConstant3', - plane3_dim/2 -1, plane3_dim/2 ).name( 'Blue Slice' ).onChange( function ( value ) {
             clipPlanes[2].constant = value;
             
             render();
         });
                     
 
         return gui;
}
