export function ampl_device_selection(measurements, device_selection_data) {

    var i = measurements.length - device_selection_data.coord - 1;
    var D1 = measurements[i].d1;
    var D2 = measurements[i].d2;
   
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
    if (ampl_selected.length > 3) {
        ampl_selected = [ampl_selected[0], ampl_selected[1], ampl_selected[2]];
    }

    return ampl_selected;
};


export function wat_device_selection(measurements, device_selection_data) {

    var i = measurements.length - device_selection_data.coord - 1;
    var D1 = measurements[i].d1;
    var wat_selected = [];

    if (D1 >= 16.8 && D1 <= 19.3) {
        wat_selected.push(0);
        
    }
    if (D1 >= 19.2 && D1 <= 22.1) {
        wat_selected.push(1);
        
    }
    if (D1 >= 21.6 && D1 <= 24.8) {
        wat_selected.push(2);
       
    }
    if (D1 >= 24 && D1 <= 27.6) {
        wat_selected.push(3);
        
    }
    if (D1 >= 26.4 && D1 <= 30.4) {
        wat_selected.push(4);
        
    }
    if (D1 > 30.4) {
        alert("Watchman Implantation - Not recommended");
    }
    return wat_selected;

}
