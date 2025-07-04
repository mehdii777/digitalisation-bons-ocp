import xlsx from "xlsx";
import fs from "fs";

// Load the Excel file
const workbook = xlsx.readFile("data.xls");

// Select the third sheet (index 2)
const sheetName = workbook.SheetNames[2];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Convert to NDJSON format (each object on a new line)
const ndjsonData = jsonData.map(item => JSON.stringify(item)).join('\n');

// Save NDJSON to file
fs.writeFileSync("dataAnalyses.ndjson", ndjsonData);

console.log("✅ Excel data converted to NDJSON!");