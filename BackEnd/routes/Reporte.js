const Express = require('express')
const Reporte = Express.Router()
const EstadoModel = require('../models').Estado

Reporte.get('/', (req, res) => {
    var Stimulsoft = require('stimulsoft-reports-js');

    // Loading fonts
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("uploads/Roboto-Black.ttf");

    // Creating new report
    var report = new Stimulsoft.Report.StiReport();

    // Loading report template
    report.loadFile("uploads/SimpleList2.mrt");

    // Remove all connections from the report template
    report.dictionary.databases.clear();

    // Create new DataSet object
    // Load JSON data file from specified URL to the DataSet object

    EstadoModel.findAll({
        raw: true
    })
    .then((result) => {
        let data = {"Estado": result}
        // dataSet.readJsonFile(JSON.stringify(result));
        // Remove all connections from the report template
        report.dictionary.databases.clear();
        // Register DataSet object
        // console.log(json(result));
        report.regData("Demo", "Demo", data);

        // Renreding report
        report.renderAsync(function () {
            // console.log("Report rendered. Pages count: ", report.renderedPages.count);

            // Saving rendered report to file
            report.saveDocumentFile("SimpleList.mdc");
            report.exportDocumentAsync((pdfData) => {
                // Converting Array into buffer
                var buffer = Buffer.from(pdfData);
                // console.log(pdfData);
                // File System module
                var fs = require('fs');

                // Saving string with rendered report in PDF into a file
                fs.writeFileSync('uploads/SimpleList.pdf', buffer);
            }, Stimulsoft.Report.StiExportFormat.Pdf);
        });
        res.status(200).json({'Estado': result})
    }).catch((err) => {
        res.status(404).json('Error')
    });
})

module.exports = Reporte