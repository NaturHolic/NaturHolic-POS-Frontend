// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const MONTHS = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December',
// ];

// const fmtDate = (ds) => {
//   const [y, m, d] = ds.split('-');
//   return `${d} ${MONTHS[parseInt(m) - 1]} ${y}`;
// };

// const fmtRs = (n) => `Rs. ${Math.floor(n || 0).toLocaleString()}`;

// const fmtDateTime = (dateStr, mode = 'date') => {
//   if (!dateStr) return '—';
//   const d = new Date(dateStr);
//   if (mode === 'time') {
//     return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
//   }
//   return (
//     d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
//     ' ' +
//     d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
//   );
// };

// // ── Safe colour setters (avoids spread-in-call-args syntax error) ─────────────
// const setFill = (doc, rgb) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
// const setDraw = (doc, rgb) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
// const setTxt  = (doc, rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

// // ── Palette ───────────────────────────────────────────────────────────────────
// const C = {
//   black:      [15,  15,  15 ],
//   white:      [255, 255, 255],
//   offWhite:   [248, 248, 248],
//   lightGrey:  [230, 230, 230],
//   midGrey:    [160, 160, 160],
//   darkGrey:   [80,  80,  80 ],
//   green:      [22,  163, 74 ],
//   greenLight: [240, 253, 244],
//   greenMid:   [187, 247, 208],
//   accent:     [148, 137, 121],
// };

// // ── Footer ────────────────────────────────────────────────────────────────────
// function _drawFooter(doc, PW, PH, generatedAt, pageNum) {
//   setFill(doc, C.lightGrey);
//   doc.rect(0, PH - 13, PW, 13, 'F');
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(6.5);
//   setTxt(doc, [120, 120, 120]);
//   doc.text('Naturholic Admin Dashboard  •  Confidential', 14, PH - 5);
//   doc.text('Generated: ' + generatedAt, PW / 2, PH - 5, { align: 'center' });
//   doc.text('Page ' + pageNum, PW - 14, PH - 5, { align: 'right' });
// }

// // ── Main export ───────────────────────────────────────────────────────────────
// export const generateSalesPDF = ({ sales, periodLabel, startDate, endDate, activePeriod }) => {
//   const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
//   const PW  = doc.internal.pageSize.getWidth();
//   const PH  = doc.internal.pageSize.getHeight();

//   // ── Derived stats ─────────────────────────────────────────────────────────
//   const totalRevenue = sales.reduce((s, x) => s + (x.TotalSellingPrice || 0), 0);
//   const totalQty     = sales.reduce((s, x) => s + (x.quantity    || 0), 0);
//   const totalUnits   = sales.reduce((s, x) => s + (x.Totalunits  || 0), 0);
//   const totalTx      = sales.length;

//   const byProduct = {};
//   sales.forEach((s) => {
//     if (!byProduct[s.productName]) {
//       byProduct[s.productName] = { qty: 0, units: 0, revenue: 0, txn: 0 };
//     }
//     byProduct[s.productName].qty     += s.quantity          || 0;
//     byProduct[s.productName].units   += s.Totalunits        || 0;
//     byProduct[s.productName].revenue += s.TotalSellingPrice || 0;
//     byProduct[s.productName].txn     += 1;
//   });

//   const now         = new Date();
//   const generatedAt =
//     now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) +
//     ' at ' +
//     now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

//   // ══════════════════════════════════════════════════════════════════════════
//   // PAGE 1 — COVER / SUMMARY
//   // ══════════════════════════════════════════════════════════════════════════

//   // Black sidebar
//   setFill(doc, C.black);
//   doc.rect(0, 0, 60, PH, 'F');

//   // Vertical brand name
//   setTxt(doc, C.white);
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(22);
//   doc.text('NATURHOLIC', 30, PH / 2 + 10, { angle: 90, align: 'center' });
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(7);
//   setTxt(doc, C.midGrey);
//   doc.text('ADMIN DASHBOARD', 30, PH / 2 - 20, { angle: 90, align: 'center' });

//   const rx = 74;

//   // Top accent line
//   setFill(doc, C.accent);
//   doc.rect(rx, 18, PW - rx - 14, 1.5, 'F');

//   // Title
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(26);
//   setTxt(doc, C.black);
//   doc.text('COUNTER SALES REPORT', rx, 36);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(11);
//   setTxt(doc, C.darkGrey);
//   doc.text(periodLabel, rx, 45);

//   doc.setFontSize(8);
//   setTxt(doc, C.midGrey);
//   doc.text('From  ' + fmtDate(startDate) + '   \u2192   ' + fmtDate(endDate), rx, 53);

//   setFill(doc, C.accent);
//   doc.rect(rx, 57, PW - rx - 14, 0.5, 'F');

//   // ── KPI tiles ──────────────────────────────────────────────────────────────
//   const tiles = [
//     { label: 'Total Transactions', value: String(totalTx),                              sub: 'sales recorded',      green: false },
//     { label: 'Total Quantity',     value: String(parseFloat(totalQty.toFixed(3))),       sub: 'packs / units sold',  green: false },
//     { label: 'Total Units',        value: String(parseFloat(totalUnits.toFixed(3))),     sub: 'base units deducted', green: false },
//     { label: 'Total Revenue',      value: fmtRs(totalRevenue),                          sub: 'selling value',       green: true  },
//   ];

//   const tileW = (PW - rx - 14) / 4 - 3;

//   tiles.forEach(function(tile, i) {
//     var tx = rx + i * (tileW + 4);
//     var ty = 64;
//     var th = 34;

//     if (tile.green) { setFill(doc, C.greenLight); } else { setFill(doc, C.offWhite); }
//     doc.roundedRect(tx, ty, tileW, th, 3, 3, 'F');
//     if (tile.green) { setDraw(doc, C.greenMid); } else { setDraw(doc, C.lightGrey); }
//     doc.setLineWidth(0.4);
//     doc.roundedRect(tx, ty, tileW, th, 3, 3, 'S');

//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(6.5);
//     setTxt(doc, C.midGrey);
//     doc.text(tile.label.toUpperCase(), tx + 5, ty + 8);

//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(tile.green ? 11 : 14);
//     if (tile.green) { setTxt(doc, C.green); } else { setTxt(doc, C.black); }
//     doc.text(tile.value, tx + 5, ty + 20);

//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(6);
//     setTxt(doc, C.midGrey);
//     doc.text(tile.sub, tx + 5, ty + 28);
//   });

//   // ── Product breakdown table ─────────────────────────────────────────────────
//   var prodRows = Object.entries(byProduct)
//     .sort(function(a, b) { return b[1].revenue - a[1].revenue; })
//     .map(function(entry, i) {
//       var name = entry[0];
//       var v    = entry[1];
//       return [
//         i + 1,
//         name,
//         v.txn,
//         parseFloat(v.qty.toFixed(3)),
//         parseFloat(v.units.toFixed(3)),
//         fmtRs(v.revenue),
//       ];
//     });

//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(9);
//   setTxt(doc, C.black);
//   doc.text('PRODUCT BREAKDOWN', rx, 107);

//   setFill(doc, C.black);
//   doc.rect(rx, 109, 14, 1, 'F');

//   autoTable(doc, {
//     startY: 113,
//     margin: { left: rx, right: 14 },
//     head: [['#', 'Product', 'Transactions', 'Quantity', 'Total Units', 'Revenue']],
//     body: prodRows,
//     styles: {
//       font: 'helvetica',
//       fontSize: 8,
//       cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
//       lineColor: C.lightGrey,
//       lineWidth: 0.3,
//     },
//     headStyles: {
//       fillColor: C.black,
//       textColor: C.white,
//       fontStyle: 'bold',
//       fontSize: 7.5,
//     },
//     alternateRowStyles: { fillColor: C.offWhite },
//     columnStyles: {
//       0: { cellWidth: 8,      halign: 'center' },
//       1: { cellWidth: 'auto' },
//       2: { cellWidth: 28,     halign: 'center' },
//       3: { cellWidth: 24,     halign: 'right'  },
//       4: { cellWidth: 26,     halign: 'right'  },
//       5: { cellWidth: 34,     halign: 'right', textColor: C.green, fontStyle: 'bold' },
//     },
//   });

//   _drawFooter(doc, PW, PH, generatedAt, 1);

//   // ══════════════════════════════════════════════════════════════════════════
//   // PAGE 2+ — DETAILED SALES TABLE
//   // ══════════════════════════════════════════════════════════════════════════
//   doc.addPage();

//   // Draw header on first detail page
//   setFill(doc, C.black);
//   doc.rect(0, 0, PW, 16, 'F');
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(8);
//   setTxt(doc, C.white);
//   doc.text('NATURHOLIC  \u2014  DETAILED SALES TRANSACTIONS', 14, 10);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(7);
//   setTxt(doc, C.midGrey);
//   doc.text(periodLabel, PW - 14, 10, { align: 'right' });
//   setFill(doc, C.accent);
//   doc.rect(0, 16, PW, 1.5, 'F');

//   var detailRows = sales.map(function(s, i) {
//     return [
//       i + 1,
//       s.productName   || '—',
//       s.vendorName    || '—',
//       s.type          || '—',
//       s.variant ? (s.variant[0] + '–' + s.variant[1]) : '—',
//       s.inventoryType || '—',
//       parseFloat((s.quantity   || 0).toFixed(3)),
//       parseFloat((s.Totalunits || 0).toFixed(3)),
//       fmtRs(s.sellingPricePerUnit),
//       fmtRs(s.TotalSellingPrice),
//       fmtDateTime(s.createdAt || s.date, activePeriod === 'day' ? 'time' : 'datetime'),
//     ];
//   });

//   autoTable(doc, {
//     startY: 22,
//     margin: { left: 14, right: 14 },
//     head: [['#', 'Product', 'Vendor', 'Type', 'Variant', 'Inv. Type', 'Qty', 'Units', 'Price/Unit', 'Total', 'Date / Time']],
//     body: detailRows,
//     styles: {
//       font: 'helvetica',
//       fontSize: 7.2,
//       cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
//       lineColor: C.lightGrey,
//       lineWidth: 0.25,
//       overflow: 'ellipsize',
//     },
//     headStyles: {
//       fillColor: C.black,
//       textColor: C.white,
//       fontStyle: 'bold',
//       fontSize: 7,
//     },
//     alternateRowStyles: { fillColor: C.offWhite },
//     columnStyles: {
//       0:  { cellWidth: 8,      halign: 'center' },
//       1:  { cellWidth: 40 },
//       2:  { cellWidth: 32 },
//       3:  { cellWidth: 14,     halign: 'center' },
//       4:  { cellWidth: 16,     halign: 'center' },
//       5:  { cellWidth: 18,     halign: 'center' },
//       6:  { cellWidth: 14,     halign: 'right'  },
//       7:  { cellWidth: 14,     halign: 'right'  },
//       8:  { cellWidth: 22,     halign: 'right'  },
//       9:  { cellWidth: 26,     halign: 'right', textColor: C.green, fontStyle: 'bold' },
//       10: { cellWidth: 'auto', halign: 'center', fontSize: 6.5, textColor: C.darkGrey },
//     },
//     didDrawPage: function(data) {
//       var pageNum = doc.internal.getCurrentPageInfo().pageNumber;
//       if (data.pageNumber > 1) {
//         setFill(doc, C.black);
//         doc.rect(0, 0, PW, 16, 'F');
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(8);
//         setTxt(doc, C.white);
//         doc.text('NATURHOLIC  \u2014  DETAILED SALES TRANSACTIONS (cont.)', 14, 10);
//         setFill(doc, C.accent);
//         doc.rect(0, 16, PW, 1.5, 'F');
//       }
//       _drawFooter(doc, PW, PH, generatedAt, pageNum);
//     },
//   });

//   _drawFooter(doc, PW, PH, generatedAt, doc.internal.getCurrentPageInfo().pageNumber);

//   doc.save('Naturholic_Sales_' + startDate + '_to_' + endDate + '.pdf');
// };




// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // ── Constants ─────────────────────────────────────────────────────────────────
// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December',
// ];

// const ML = 14; // margin left
// const MR = 14; // margin right

// // ── Colour helpers ────────────────────────────────────────────────────────────
// const setFill = (doc, r, g, b) => doc.setFillColor(r, g, b);
// const setTxt  = (doc, r, g, b) => doc.setTextColor(r, g, b);
// const setDraw = (doc, r, g, b) => doc.setDrawColor(r, g, b);

// // ── Formatters ────────────────────────────────────────────────────────────────
// function fmtDate(ds) {
//   var parts = ds.split('-');
//   return parts[2] + ' ' + MONTHS[parseInt(parts[1]) - 1] + ' ' + parts[0];
// }

// function fmtRs(n) {
//   return 'Rs. ' + Math.floor(n || 0).toLocaleString();
// }

// function fmtTime(dateStr) {
//   if (!dateStr) return '-';
//   var d = new Date(dateStr);
//   return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
// }

// function fmtFullDate(dateStr) {
//   if (!dateStr) return '-';
//   var d = new Date(dateStr);
//   return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//     + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
// }

// // ── Footer ────────────────────────────────────────────────────────────────────
// function drawFooter(doc, PW, PH, generatedAt, pageNum) {
//   // thin top border line
//   setDraw(doc, 200, 200, 200);
//   doc.setLineWidth(0.3);
//   doc.line(ML, PH - 10, PW - MR, PH - 10);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(6.5);
//   setTxt(doc, 150, 150, 150);
//   doc.text('Naturholic  |  Counter Sales Report  |  Confidential', ML, PH - 5.5);
//   doc.text('Generated: ' + generatedAt, PW / 2, PH - 5.5, { align: 'center' });
//   doc.text('Page ' + pageNum, PW - MR, PH - 5.5, { align: 'right' });
// }

// // ── Header stripe (for detail pages) ─────────────────────────────────────────
// function drawDetailHeader(doc, PW, periodLabel) {
//   setFill(doc, 15, 15, 15);
//   doc.rect(0, 0, PW, 14, 'F');
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(8);
//   setTxt(doc, 255, 255, 255);
//   doc.text('NATURHOLIC  |  COUNTER SALES  |  DETAILED TRANSACTIONS', ML, 9);
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(7);
//   setTxt(doc, 180, 180, 180);
//   doc.text(periodLabel, PW - MR, 9, { align: 'right' });

//   // accent line under header
//   setFill(doc, 148, 137, 121);
//   doc.rect(0, 14, PW, 1, 'F');
// }

// // ── Main export ───────────────────────────────────────────────────────────────
// export const generateSalesPDF = function(opts) {
//   var sales       = opts.sales;
//   var periodLabel = opts.periodLabel;
//   var startDate   = opts.startDate;
//   var endDate     = opts.endDate;
//   var activePeriod = opts.activePeriod;

//   var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
//   var PW  = doc.internal.pageSize.getWidth();   // 297
//   var PH  = doc.internal.pageSize.getHeight();  // 210

//   // ── Stats ──────────────────────────────────────────────────────────────────
//   var totalRevenue = 0, totalQty = 0, totalUnits = 0;
//   sales.forEach(function(s) {
//     totalRevenue += s.TotalSellingPrice || 0;
//     totalQty     += s.quantity          || 0;
//     totalUnits   += s.Totalunits        || 0;
//   });
//   var totalTx = sales.length;

//   var byProduct = {};
//   sales.forEach(function(s) {
//     if (!byProduct[s.productName]) {
//       byProduct[s.productName] = { qty: 0, units: 0, revenue: 0, txn: 0 };
//     }
//     byProduct[s.productName].qty     += s.quantity          || 0;
//     byProduct[s.productName].units   += s.Totalunits        || 0;
//     byProduct[s.productName].revenue += s.TotalSellingPrice || 0;
//     byProduct[s.productName].txn     += 1;
//   });

//   var now = new Date();
//   var generatedAt =
//     now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) +
//     ' at ' +
//     now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

//   // ══════════════════════════════════════════════════════════════════════════
//   // PAGE 1  —  SUMMARY
//   // ══════════════════════════════════════════════════════════════════════════

//   // ── Top header bar ─────────────────────────────────────────────────────────
//   setFill(doc, 15, 15, 15);
//   doc.rect(0, 0, PW, 20, 'F');

//   // Brand
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(14);
//   setTxt(doc, 255, 255, 255);
//   doc.text('NATURHOLIC', ML, 13);

//   // Pipe separator
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   setTxt(doc, 100, 100, 100);
//   doc.text('|', ML + 42, 13);

//   // Report label
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(9);
//   setTxt(doc, 200, 200, 200);
//   doc.text('Counter Sales Report', ML + 47, 13);

//   // Date range on the right
//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(8);
//   setTxt(doc, 160, 160, 160);
//   doc.text(fmtDate(startDate) + '  to  ' + fmtDate(endDate), PW - MR, 13, { align: 'right' });

//   // Accent underline
//   setFill(doc, 148, 137, 121);
//   doc.rect(0, 20, PW, 1.2, 'F');

//   // ── Period title ───────────────────────────────────────────────────────────
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(18);
//   setTxt(doc, 15, 15, 15);
//   doc.text(periodLabel, ML, 34);

//   doc.setFont('helvetica', 'normal');
//   doc.setFontSize(8.5);
//   setTxt(doc, 100, 100, 100);
//   doc.text(fmtDate(startDate) + '  \u2014  ' + fmtDate(endDate), ML, 41);

//   // thin separator
//   setDraw(doc, 220, 220, 220);
//   doc.setLineWidth(0.3);
//   doc.line(ML, 45, PW - MR, 45);

//   // ── KPI tiles (4 across full width) ───────────────────────────────────────
//   var tiles = [
//     { label: 'TOTAL TRANSACTIONS', value: String(totalTx),                                   sub: 'sales recorded',      green: false },
//     { label: 'TOTAL QUANTITY',     value: String(parseFloat(totalQty.toFixed(3))),            sub: 'packs / units sold',  green: false },
//     { label: 'TOTAL UNITS SOLD',   value: String(parseFloat(totalUnits.toFixed(3))),          sub: 'base units deducted', green: false },
//     { label: 'TOTAL REVENUE',      value: fmtRs(totalRevenue),                               sub: 'selling value',       green: true  },
//   ];

//   var usableW = PW - ML - MR;
//   var tileW   = usableW / 4 - 2;
//   var tileY   = 49;
//   var tileH   = 28;

//   tiles.forEach(function(tile, i) {
//     var tx = ML + i * (tileW + 2.67);

//     // Background
//     if (tile.green) {
//       setFill(doc, 240, 253, 244);
//     } else {
//       setFill(doc, 250, 250, 250);
//     }
//     doc.rect(tx, tileY, tileW, tileH, 'F');

//     // Border
//     if (tile.green) {
//       setDraw(doc, 134, 239, 172);
//     } else {
//       setDraw(doc, 220, 220, 220);
//     }
//     doc.setLineWidth(0.35);
//     doc.rect(tx, tileY, tileW, tileH, 'S');

//     // Left colour accent bar
//     if (tile.green) {
//       setFill(doc, 22, 163, 74);
//     } else {
//       setFill(doc, 15, 15, 15);
//     }
//     doc.rect(tx, tileY, 2, tileH, 'F');

//     // Label
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(6);
//     setTxt(doc, 130, 130, 130);
//     doc.text(tile.label, tx + 5, tileY + 7);

//     // Value
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(tile.green ? 12 : 15);
//     if (tile.green) {
//       setTxt(doc, 22, 163, 74);
//     } else {
//       setTxt(doc, 15, 15, 15);
//     }
//     doc.text(tile.value, tx + 5, tileY + 19);

//     // Sub label
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(6);
//     setTxt(doc, 160, 160, 160);
//     doc.text(tile.sub, tx + 5, tileY + 24.5);
//   });

//   // ── Section heading ────────────────────────────────────────────────────────
//   var sectionY = tileY + tileH + 9;
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(8.5);
//   setTxt(doc, 15, 15, 15);
//   doc.text('PRODUCT BREAKDOWN', ML, sectionY);

//   // underline
//   setFill(doc, 15, 15, 15);
//   doc.rect(ML, sectionY + 1.5, 32, 0.8, 'F');

//   // ── Product breakdown table ────────────────────────────────────────────────
//   var prodRows = Object.entries(byProduct)
//     .sort(function(a, b) { return b[1].revenue - a[1].revenue; })
//     .map(function(entry, i) {
//       var name = entry[0];
//       var v    = entry[1];
//       return [
//         i + 1,
//         name,
//         v.txn,
//         parseFloat(v.qty.toFixed(3)),
//         parseFloat(v.units.toFixed(3)),
//         fmtRs(v.revenue),
//       ];
//     });

//   autoTable(doc, {
//     startY: sectionY + 4,
//     margin: { left: ML, right: MR },
//     tableWidth: PW - ML - MR,
//     head: [['#', 'Product Name', 'Transactions', 'Quantity', 'Total Units', 'Revenue']],
//     body: prodRows,
//     styles: {
//       font: 'helvetica',
//       fontSize: 8,
//       cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
//       lineColor: [220, 220, 220],
//       lineWidth: 0.25,
//       overflow: 'linebreak',
//     },
//     headStyles: {
//       fillColor: [15, 15, 15],
//       textColor: [255, 255, 255],
//       fontStyle: 'bold',
//       fontSize: 7.5,
//       cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
//     },
//     alternateRowStyles: {
//       fillColor: [250, 250, 250],
//     },
//     columnStyles: {
//       0: { cellWidth: 10,      halign: 'center', textColor: [150, 150, 150] },
//       1: { cellWidth: 'auto',  halign: 'left'   },
//       2: { cellWidth: 30,      halign: 'center' },
//       3: { cellWidth: 30,      halign: 'right'  },
//       4: { cellWidth: 32,      halign: 'right'  },
//       5: { cellWidth: 40,      halign: 'right',  textColor: [22, 163, 74], fontStyle: 'bold' },
//     },
//     didDrawCell: function(data) {
//       // draw right-align revenue column text in green handled by columnStyles
//     },
//   });

//   // Footer
//   drawFooter(doc, PW, PH, generatedAt, 1);

//   // ══════════════════════════════════════════════════════════════════════════
//   // PAGE 2+  —  DETAILED TRANSACTIONS
//   // ══════════════════════════════════════════════════════════════════════════
//   doc.addPage();
//   drawDetailHeader(doc, PW, periodLabel);

//   var detailRows = sales.map(function(s, i) {
//     var dateStr = s.createdAt || s.date;
//     var timeCol = activePeriod === 'day' ? fmtTime(dateStr) : fmtFullDate(dateStr);
//     return [
//       i + 1,
//       s.productName   || '-',
//       s.vendorName    || '-',
//       s.type          || '-',
//       s.variant ? (s.variant[0] + ' - ' + s.variant[1]) : '-',
//       s.inventoryType || '-',
//       parseFloat((s.quantity   || 0).toFixed(3)),
//       parseFloat((s.Totalunits || 0).toFixed(3)),
//       fmtRs(s.sellingPricePerUnit),
//       fmtRs(s.TotalSellingPrice),
//       timeCol,
//     ];
//   });

//   autoTable(doc, {
//     startY: 18,
//     margin: { left: ML, right: MR },
//     tableWidth: PW - ML - MR,
//     head: [['#', 'Product', 'Vendor', 'Type', 'Variant', 'Inv. Type', 'Qty', 'Units', 'Price/Unit', 'Total', activePeriod === 'day' ? 'Time' : 'Date & Time']],
//     body: detailRows,
//     styles: {
//       font: 'helvetica',
//       fontSize: 7.5,
//       cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
//       lineColor: [220, 220, 220],
//       lineWidth: 0.2,
//       overflow: 'linebreak',
//     },
//     headStyles: {
//       fillColor: [40, 40, 40],
//       textColor: [255, 255, 255],
//       fontStyle: 'bold',
//       fontSize: 7,
//       cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
//     },
//     alternateRowStyles: {
//       fillColor: [250, 250, 250],
//     },
//     // Fixed widths that add up to exactly 269 (297 - 14 - 14)
//     columnStyles: {
//       0:  { cellWidth: 9,   halign: 'center', textColor: [160, 160, 160], fontSize: 7 },
//       1:  { cellWidth: 50,  halign: 'left'   },
//       2:  { cellWidth: 38,  halign: 'left'   },
//       3:  { cellWidth: 14,  halign: 'center' },
//       4:  { cellWidth: 18,  halign: 'center' },
//       5:  { cellWidth: 20,  halign: 'center' },
//       6:  { cellWidth: 14,  halign: 'right'  },
//       7:  { cellWidth: 14,  halign: 'right'  },
//       8:  { cellWidth: 26,  halign: 'right'  },
//       9:  { cellWidth: 30,  halign: 'right',  textColor: [22, 163, 74], fontStyle: 'bold' },
//       10: { cellWidth: 36,  halign: 'center', textColor: [100, 100, 100], fontSize: 7 },
//     },
//     didDrawPage: function(data) {
//       var pageNum = doc.internal.getCurrentPageInfo().pageNumber;
//       if (data.pageNumber > 1) {
//         drawDetailHeader(doc, PW, periodLabel);
//       }
//       drawFooter(doc, PW, PH, generatedAt, pageNum);
//     },
//   });

//   // Make sure footer is on the last page
//   drawFooter(doc, PW, PH, generatedAt, doc.internal.getCurrentPageInfo().pageNumber);

//   // ── Totals row summary at the very end ─────────────────────────────────────
//   // Already handled by the KPI tiles on page 1

//   doc.save('Naturholic_Sales_' + startDate + '_to_' + endDate + '.pdf');
// };





import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const ML = 8; // margin left
const MR = 8; // margin right

// ── Colour helpers ────────────────────────────────────────────────────────────
const setFill = (doc, r, g, b) => doc.setFillColor(r, g, b);
const setTxt  = (doc, r, g, b) => doc.setTextColor(r, g, b);
const setDraw = (doc, r, g, b) => doc.setDrawColor(r, g, b);

// ── Formatters ────────────────────────────────────────────────────────────────
function fmtDate(ds) {
  var parts = ds.split('-');
  return parts[2] + ' ' + MONTHS[parseInt(parts[1]) - 1] + ' ' + parts[0];
}

function fmtRs(n) {
  return 'Rs. ' + Math.floor(n || 0).toLocaleString();
}

function fmtTime(dateStr) {
  if (!dateStr) return '-';
  var d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function fmtFullDate(dateStr) {
  if (!dateStr) return '-';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ── Footer ────────────────────────────────────────────────────────────────────
function drawFooter(doc, PW, PH, generatedAt, pageNum) {
  // thin top border line
  setDraw(doc, 200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(ML, PH - 10, PW - MR, PH - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  setTxt(doc, 150, 150, 150);
  doc.text('Naturholic  |  Counter Sales Report  |  Confidential', ML, PH - 5.5);
  doc.text('Generated: ' + generatedAt, PW / 2, PH - 5.5, { align: 'center' });
  doc.text('Page ' + pageNum, PW - MR, PH - 5.5, { align: 'right' });
}

// ── Header stripe (for detail pages) ─────────────────────────────────────────
function drawDetailHeader(doc, PW, periodLabel) {
  setFill(doc, 15, 15, 15);
  doc.rect(0, 0, PW, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTxt(doc, 255, 255, 255);
  doc.text('NATURHOLIC  |  COUNTER SALES  |  DETAILED TRANSACTIONS', ML, 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setTxt(doc, 180, 180, 180);
  doc.text(periodLabel, PW - MR, 9, { align: 'right' });

  // accent line under header
  setFill(doc, 148, 137, 121);
  doc.rect(0, 14, PW, 1, 'F');
}

// ── Main export ───────────────────────────────────────────────────────────────
export const generateSalesPDF = function(opts) {
  var sales       = opts.sales;
  var periodLabel = opts.periodLabel;
  var startDate   = opts.startDate;
  var endDate     = opts.endDate;
  var activePeriod = opts.activePeriod;

  var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  var PW  = doc.internal.pageSize.getWidth();   // 297
  var PH  = doc.internal.pageSize.getHeight();  // 210

  // ── Stats ──────────────────────────────────────────────────────────────────
  var totalRevenue = 0, totalQty = 0, totalUnits = 0;
  sales.forEach(function(s) {
    totalRevenue += s.TotalSellingPrice || 0;
    totalQty     += s.quantity          || 0;
    totalUnits   += s.Totalunits        || 0;
  });
  var totalTx = sales.length;

  var byProduct = {};
  sales.forEach(function(s) {
    if (!byProduct[s.productName]) {
      byProduct[s.productName] = { qty: 0, units: 0, revenue: 0, txn: 0 };
    }
    byProduct[s.productName].qty     += s.quantity          || 0;
    byProduct[s.productName].units   += s.Totalunits        || 0;
    byProduct[s.productName].revenue += s.TotalSellingPrice || 0;
    byProduct[s.productName].txn     += 1;
  });

  var now = new Date();
  var generatedAt =
    now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' at ' +
    now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1  —  SUMMARY
  // ══════════════════════════════════════════════════════════════════════════

  // ── Top header bar ─────────────────────────────────────────────────────────
  setFill(doc, 15, 15, 15);
  doc.rect(0, 0, PW, 20, 'F');

  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setTxt(doc, 255, 255, 255);
  doc.text('NATURHOLIC', ML, 13);

  // Pipe separator
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setTxt(doc, 100, 100, 100);
  doc.text('|', ML + 42, 13);

  // Report label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setTxt(doc, 200, 200, 200);
  doc.text('Counter Sales Report', ML + 47, 13);

  // Date range on the right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTxt(doc, 160, 160, 160);
  doc.text(fmtDate(startDate) + '  to  ' + fmtDate(endDate), PW - MR, 13, { align: 'right' });

  // Accent underline
  setFill(doc, 148, 137, 121);
  doc.rect(0, 20, PW, 1.2, 'F');

  // ── Period title ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  setTxt(doc, 15, 15, 15);
  doc.text(periodLabel, ML, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setTxt(doc, 100, 100, 100);
  doc.text(fmtDate(startDate) + '  \u2014  ' + fmtDate(endDate), ML, 41);

  // thin separator
  setDraw(doc, 220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(ML, 45, PW - MR, 45);

  // ── KPI tiles (4 across full width) ───────────────────────────────────────
  var tiles = [
    { label: 'TOTAL TRANSACTIONS', value: String(totalTx),                                   sub: 'sales recorded',      green: false },
    { label: 'TOTAL QUANTITY',     value: String(parseFloat(totalQty.toFixed(3))),            sub: 'packs / units sold',  green: false },
    { label: 'TOTAL UNITS SOLD',   value: String(parseFloat(totalUnits.toFixed(3))),          sub: 'base units deducted', green: false },
    { label: 'TOTAL REVENUE',      value: fmtRs(totalRevenue),                               sub: 'selling value',       green: true  },
  ];

  var usableW = PW - ML - MR;
  var tileW   = usableW / 4 - 2;
  var tileY   = 49;
  var tileH   = 28;

  tiles.forEach(function(tile, i) {
    var tx = ML + i * (tileW + 2.67);

    // Background
    if (tile.green) {
      setFill(doc, 240, 253, 244);
    } else {
      setFill(doc, 250, 250, 250);
    }
    doc.rect(tx, tileY, tileW, tileH, 'F');

    // Border
    if (tile.green) {
      setDraw(doc, 134, 239, 172);
    } else {
      setDraw(doc, 220, 220, 220);
    }
    doc.setLineWidth(0.35);
    doc.rect(tx, tileY, tileW, tileH, 'S');

    // Left colour accent bar
    if (tile.green) {
      setFill(doc, 22, 163, 74);
    } else {
      setFill(doc, 15, 15, 15);
    }
    doc.rect(tx, tileY, 2, tileH, 'F');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    setTxt(doc, 130, 130, 130);
    doc.text(tile.label, tx + 5, tileY + 7);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(tile.green ? 12 : 15);
    if (tile.green) {
      setTxt(doc, 22, 163, 74);
    } else {
      setTxt(doc, 15, 15, 15);
    }
    doc.text(tile.value, tx + 5, tileY + 19);

    // Sub label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    setTxt(doc, 160, 160, 160);
    doc.text(tile.sub, tx + 5, tileY + 24.5);
  });

  // ── Section heading ────────────────────────────────────────────────────────
  var sectionY = tileY + tileH + 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  setTxt(doc, 15, 15, 15);
  doc.text('PRODUCT BREAKDOWN', ML, sectionY);

  // underline
  setFill(doc, 15, 15, 15);
  doc.rect(ML, sectionY + 1.5, 32, 0.8, 'F');

  // ── Product breakdown table ────────────────────────────────────────────────
  var prodRows = Object.entries(byProduct)
    .sort(function(a, b) { return b[1].revenue - a[1].revenue; })
    .map(function(entry, i) {
      var name = entry[0];
      var v    = entry[1];
      return [
        i + 1,
        name,
        v.txn,
        parseFloat(v.qty.toFixed(3)),
        parseFloat(v.units.toFixed(3)),
        fmtRs(v.revenue),
      ];
    });

  autoTable(doc, {
    startY: sectionY + 4,
    margin: { left: ML, right: MR },
    tableWidth: PW - ML - MR,
    head: [['#', 'Product Name', 'Transactions', 'Quantity', 'Total Units', 'Revenue']],
    body: prodRows,
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [15, 15, 15],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { cellWidth: 10,      halign: 'center', textColor: [150, 150, 150] },
      1: { cellWidth: 'auto',  halign: 'left'   },
      2: { cellWidth: 30,      halign: 'center' },
      3: { cellWidth: 30,      halign: 'right'  },
      4: { cellWidth: 32,      halign: 'right'  },
      5: { cellWidth: 40,      halign: 'right',  textColor: [22, 163, 74], fontStyle: 'bold' },
    },
    didDrawCell: function(data) {
      // draw right-align revenue column text in green handled by columnStyles
    },
  });

  // Footer
  drawFooter(doc, PW, PH, generatedAt, 1);

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2+  —  DETAILED TRANSACTIONS
  // ══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  drawDetailHeader(doc, PW, periodLabel);

  var detailRows = sales.map(function(s, i) {
    var dateStr = s.createdAt || s.date;
    var timeCol = activePeriod === 'day' ? fmtTime(dateStr) : fmtFullDate(dateStr);
    return [
      i + 1,
      s.productName   || '-',
      s.vendorName    || '-',
      s.type          || '-',           // "Bag" / "Box" — never wraps
      s.variant ? (s.variant[0] + '-' + s.variant[1]) : '-',  // "1-50" — no spaces
      s.inventoryType || '-',           // "bulk" / "openstock"
      parseFloat((s.quantity || 0).toFixed(3)),
      fmtRs(s.sellingPricePerUnit),
      fmtRs(s.TotalSellingPrice),
      timeCol,
    ];
  });

  // Total usable width = 297 - 8 - 8 = 281mm
  // Column widths below sum to 281
  autoTable(doc, {
    startY: 18,
    margin: { left: ML, right: MR },
    tableWidth: PW - ML - MR,
    head: [['#', 'Product', 'Vendor', 'Type', 'Variant', 'Inv. Type', 'Qty', 'Price/Unit', 'Total', activePeriod === 'day' ? 'Time' : 'Date & Time']],
    body: detailRows,
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      overflow: 'linebreak',
      minCellHeight: 0,
    },
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    // Widths: 8 + 50 + 40 + 16 + 20 + 24 + 14 + 28 + 32 + 41 = 281
    columnStyles: {
      0: { cellWidth: 8,   halign: 'center', textColor: [160, 160, 160], fontSize: 7 },
      1: { cellWidth: 50,  halign: 'left'   },
      2: { cellWidth: 40,  halign: 'left'   },
      3: { cellWidth: 16,  halign: 'center' },   // "Bag"/"Box" — 3 chars, 16 is plenty
      4: { cellWidth: 20,  halign: 'center' },   // "1-50" — no spaces so no wrap
      5: { cellWidth: 24,  halign: 'center' },   // "openstock" — 9 chars needs ~22
      6: { cellWidth: 14,  halign: 'right'  },
      7: { cellWidth: 28,  halign: 'right'  },
      8: { cellWidth: 32,  halign: 'right',  textColor: [22, 163, 74], fontStyle: 'bold' },
      9: { cellWidth: 49,  halign: 'center', textColor: [100, 100, 100], fontSize: 7 },
    },
    didDrawPage: function(data) {
      var pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      if (data.pageNumber > 1) {
        drawDetailHeader(doc, PW, periodLabel);
      }
      drawFooter(doc, PW, PH, generatedAt, pageNum);
    },
  });

  // ── Totals row summary at the very end ─────────────────────────────────────
  // Already handled by the KPI tiles on page 1

  doc.save('Naturholic_Sales_' + startDate + '_to_' + endDate + '.pdf');
};