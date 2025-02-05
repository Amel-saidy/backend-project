const PDFDocument = require('pdfkit');
const fs = require('fs');
const ExcelJS = require('exceljs');

// Generate PDF Report notification
function generatePDFReport(data, fileName) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(fileName));

  doc.fontSize(16).text('Attendance Report', { align: 'center' });
  doc.moveDown();

  data.forEach((record, index) => {
    doc.fontSize(12).text(`${index + 1}. ${record.userId.name} - ${new Date(record.checkIn).toLocaleString()}`);
  });

  doc.end();
}

// Generate Excel Report notification
async function generateExcelReport(data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance');
  
    sheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Check-In', key: 'checkIn', width: 20 },
      { header: 'Check-Out', key: 'checkOut', width: 20 },
    ];
  
    data.forEach((record) => {
      sheet.addRow({
        name: record.userId.name,
        checkIn: new Date(record.checkIn).toLocaleString(),
        checkOut: record.checkOut ? new Date(record.checkOut).toLocaleString() : 'N/A',
      });
    });
  
    await workbook.xlsx.writeFile(fileName);
  }


module.exports = { generatePDFReport, generateExcelReport };
