import {
    readXlsxWorkbook,
    convertWorkbookToCSVMap,
    convertCSVMapInJSONMap,

} from './../../modules/pl_module_xlsx';

export function import_data_to_app(file, callback) {

    readXlsxWorkbook(file, function (result) {

        if (result) {

            var worbook_csv_map = convertWorkbookToCSVMap(result);

            var worbook_json_map = convertCSVMapInJSONMap(worbook_csv_map);


            callback(worbook_json_map);

        } else {
            callback(false);
        }

    });

}