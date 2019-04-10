import Papaparse from 'papaparse';
import XLSX from 'xlsx';
import {
    keys,
    union,
    without
} from 'underscore';

import { isObjectEmpty, isObjectAnArray } from './pl_module_object';


function get_keys_from_data(data, non_required_keys) {

    var data_keys = [];

    if (!isObjectEmpty(data)) {

        if (isObjectAnArray(data)) {

            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                var item_keys = keys(item);

                data_keys = union(data_keys, item_keys);
            }

            for (var j = 0; j < non_required_keys.length; j++) {

                var non_required_field = non_required_keys[j];

                data_keys = without(data_keys, non_required_field);
            }
        }
    }

    return data_keys;

}

function get_none_required_fields(data) {

    var data_keys = [];

    if (!isObjectEmpty(data)) {

        if (isObjectAnArray(data)) {

            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                var item_keys = keys(item);

                for (var j = 0; j < item_keys.length; j++) {

                    var item_key = item_keys[j];

                    if (isObjectAnArray(item[item_key])) {

                        if (data_keys.indexOf(item_key) === -1) {

                            data_keys.push(item_key);
                        }


                    }
                }
            }
        }
    }

    return data_keys;


}

function convert_json_to_array_of_arrays(keys, data) {

    var array = [];

    for (var i = 0; i < data.length; i++) {

        var data_item = data[i];
        var new_data_item = [];

        for (var j = 0; j < keys.length; j++) {

            var data_key = keys[j];

            if (data_key in data_item) {

                new_data_item.push(data_item[data_key]);

            } else {

                new_data_item.push("");
            }

        }

        array.push(new_data_item);
    }

    return array;
}

function create_workbook_from_header_and_rows(header, rows) {

    var workbook = [];

    workbook.push(header);

    for (var i = 0; i < rows.length; i++) {
        workbook.push(rows[i]);
    }

    return workbook;

}

export function readXlsxWorkbook(file, callback) {

    var reader = new FileReader();

    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.indexOf("xlsx") != -1) {

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            callback(workbook);
        };
        reader.readAsBinaryString(file);

    } else {
        callback(false);
    }


}

export function writeXlsxWoorkbook(data, opts) {

    var workbook_names = keys(data);
    const wb = XLSX.utils.book_new();

    for (var i = 0; i < workbook_names.length; i++) {

        var workbook_array_json = data[workbook_names[i]];
        var workbook_none_required_fields = get_none_required_fields(workbook_array_json);
        var workbook_header = get_keys_from_data(workbook_array_json, workbook_none_required_fields);
        var workbook_array_of_arrays = convert_json_to_array_of_arrays(workbook_header, workbook_array_json);
        var workbook_header_plus_array_of_arrays = create_workbook_from_header_and_rows(workbook_header, workbook_array_of_arrays);
        var sheet = XLSX.utils.aoa_to_sheet(workbook_header_plus_array_of_arrays);
        var sheet_name = workbook_names[i];
        XLSX.utils.book_append_sheet(wb,sheet, sheet_name);
    }

    XLSX.writeFile(wb, "database.xlsx")

}

export function convertWorkbookToCSVMap(workbook) {

    var resultcsv = {};

    workbook.SheetNames.forEach(function (sheetName) {

        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

        if (csv.length > 0) {

            resultcsv[sheetName.toLowerCase()] = csv;
        }
    });

    return resultcsv;
}

export function convertCSVMapInJSONMap(csvMap) {

    var tempMap = {};
    var jsonMap = {};

    //parse csv
    for (var key in csvMap) {
        if (csvMap.hasOwnProperty(key)) {

            var data = Papaparse.parse(csvMap[key], {
                delimiter: "",	// auto-detect
                newline: "",	// auto-detect
                header: false,
                dynamicTyping: true,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                step: undefined,
                complete: undefined,
                error: undefined,
                download: false,
                skipEmptyLines: true,
                chunk: undefined,
                fastMode: undefined,
                beforeFirstChunk: undefined,
                withCredentials: undefined
            });

            var csvrows = data.data;
            var headers = csvrows[0];
            var json = [];

            for (var i = 1; i < csvrows.length; i++) {

                var obj = {};
                var currentline = csvrows[i];

                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j].toLowerCase()] = currentline[j];
                }

                json.push(obj);
            }

            jsonMap[key] = json;
        }
    }

    return jsonMap;
}






