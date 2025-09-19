import React from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import getSChema from "../functions/getSchema";
import { on } from "events";
interface FileUploaderProps {
  onFileUpload: (file: File, data: any[], headers: string[], collumns: string[], shape :string[], dtypes:string[], describe: string[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;  // Exit if no file is selected
    const ext = file.name.split(".").pop()?.toLowerCase();  // Get file extension
    if (ext === "csv") {
      // console.log("CSV file selected");
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as any[];
          const headers = results.meta.fields || [];
          try {
             // Get schema info using custom getSChema function
            const schemaResult = await getSChema(file);
            if (schemaResult) {
              const { columns, shape, dtypes, describe } = schemaResult;
              // Trigger callback with all parsed information
              // console.log("info:", columns, shape, dtypes);
              // console.log("Describe:", describe);
              onFileUpload(file, data, headers,columns, shape.map(String), dtypes, describe);
            } else {
              console.warn("getSChema did not return a schema object.");
            }
          } catch (error) {
            console.error("Error getting schema:", error);
          }
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      // console.log("Excel file selected");
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const columns: string[] = [];
        const shape: string[] = [];
        const dtypes: string[] = [];
        const describe: string[] = [];
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON (array of arrays)
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        const headers = json[0] as string[];
        const rows = json.slice(1).map(row =>
          Object.fromEntries(headers.map((h, i) => [h, row[i]]))
        );
        // onFileUpload(file, data, headers,columns, shape, dtypes, describe);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Only .csv files are supported."); // Warn if unsupported file type
    }
  };

   return (
    <div>
      <div style={{ marginBottom: 8, color: '#2a4d7a', fontWeight: 500 }}>
        Currently only support .csv file
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;