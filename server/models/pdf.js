const mongoose = require('mongoose');
const pdfSchema = new mongoose.Schema({
    pdf: {
        data: Buffer,
        contentType: String
    }
});
const pdfModel = mongoose.model("Pdf", pdfSchema);

module.exports = pdfModel;