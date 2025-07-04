const xlsx = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = xlsx.readFile("data.xls");

// Select the first sheet
const sheetName = workbook.SheetNames[1];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Save JSON to file
fs.writeFileSync("dataTypes.json", JSON.stringify(jsonData, null, 2));

console.log("✅ Excel data converted to JSON!");
