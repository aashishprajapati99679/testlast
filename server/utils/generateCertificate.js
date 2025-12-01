const PDFDocument = require('pdfkit');

const generateCertificate = (res, studentName, courseName, date, duration) => {
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    // If res is a writable stream (like response), pipe to it
    if (res && typeof res.write === 'function') {
        doc.pipe(res);
    }

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    // Header
    doc.fontSize(40).text('CERTIFICATE OF COMPLETION', {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(25).text('This is to certify that', {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(35).text(studentName, {
        align: 'center',
        underline: true
    });

    doc.moveDown();
    doc.fontSize(25).text('Has successfully completed the volunteering opportunity', {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(30).text(courseName, {
        align: 'center',
    });

    if (duration) {
        doc.moveDown();
        doc.fontSize(20).text(`Total Volunteered Hours: ${duration}`, {
            align: 'center',
        });
    }

    doc.moveDown();
    doc.fontSize(20).text(`Date: ${date}`, {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(15).text('GETSERVE.in', {
        align: 'center',
    });

    doc.end();

    return doc;
};

module.exports = generateCertificate;
