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



export function create_gui(params, mesh, mesh1, render) {

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

function show_only_selected_device(folder,text,value){

    for(var i=0;i<folder.__controllers.length;i++){

        var controller = folder.__controllers[i];
        var property = controller.property;

        if(property.indexOf("Ampl.")!== -1){

            if(property !== text){

                if(value === true){

                    controller.setValue(false);

                }
            }
        }

    }
}

function show_only_selected_wat_device(folder,text,value){

    for(var i=0;i<folder.__controllers.length;i++){

        var controller = folder.__controllers[i];
        var property = controller.property;

        if(property.indexOf("Wat.")!== -1){

            if(property !== text){

                if(value === true){

                    controller.setValue(false);

                }
            }
        }

    }
}

export function create_ampl_AMULET_gui(text,visibility,amplatzer_folder,ampl,devices,render,control){
    var params = {
        'scale_X': 1,
        'scale_Y': 1,
        'scale_Z': 1
    }

    amplatzer_folder.add(visibility, text).onChange(function (value) {
 
        show_only_selected_device(amplatzer_folder,text,value);

        ampl.visible = value;
        
        if (ampl.visible == true){
            control.attach(ampl);
        }
        if(ampl.visible == false){
            control.detach(ampl);
        }
        render();
    });
   

    amplatzer_folder.add(params,'scale_X',0.8,1.2).name('Scale X').onChange(function (value){
        ampl.scale.x = value;
    });
    amplatzer_folder.add(params,'scale_Y',0.8,1.2).name('Scale Y').onChange(function (value){
        ampl.scale.y = value;
    });
    amplatzer_folder.add(params,'scale_Z',0.8,1.2).name('Scale Z').onChange(function (value){
        ampl.scale.z = value;
    });
console.log(amplatzer_folder);

}

export function create_Watchman_gui(text,visibility,watchman_folder,wat,render,control){
    
    var params = {
        'scale_X': 1,
        'scale_Y': 1,
        'scale_Z': 1
    }

    watchman_folder.add(visibility, text).onChange(function (value) {
        show_only_selected_wat_device(watchman_folder,text,value);
        wat.visible = value;
        if (wat.visible == true){
            control.attach(wat);
        }
        if(wat.visible == false){
            control.detach(wat);
        }
        render();
    });
    
    watchman_folder.add(params,'scale_X',0.8,1.2).name('Scale X').onChange(function (value){
        wat.scale.x = value;
    });
    watchman_folder.add(params,'scale_Y',0.8,1.2).name('Scale Y').onChange(function (value){
        wat.scale.y = value;
    });
    watchman_folder.add(params,'scale_Z',0.8,1.2).name('Scale Z').onChange(function (value){
        wat.scale.z = value;
    });

}

export function placeGUI(gui) {

    // we obtain the container in which the created "gui" will be appended
    var container_gui_menu = document.getElementById("container-gui-menu");
    // and we append "gui" to it ("container_gui_menu")
    container_gui_menu.appendChild(gui.domElement);
}
