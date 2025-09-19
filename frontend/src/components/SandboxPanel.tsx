import React from "react";
import FileUploader from "./FileUploader";

interface SandboxPanelProps {
  file: File | null;
  tableHeaders: string[];
  tableData: any[];
  columns: string[];
  shape: string[];
  dtypes: string[];
  describe: string[];
  summary: string;
  notebookCode: string;
  onFileUpload: (file: File, data: any[], headers: string[],collumns: string[], shape :string[], dtypes:string[], describe: string[]) => void;
  setNotebookCode: (code: string) => void;  // Function to update notebook code
}

const SandboxPanel: React.FC<SandboxPanelProps> = ({
  file,
  tableHeaders,
  tableData,  
  columns,
  shape,
  dtypes,
  describe,
  summary,
  notebookCode,
  onFileUpload,
  setNotebookCode,
}) => (
  <div className="sandbox-panel">
    <h2 style={{ color: "#2a4d7a" }}> Chart Maker</h2>
    <FileUploader onFileUpload={onFileUpload} />
    {file && (
      <div style={{ marginTop: 12 }}>
        <p>
          Selected file: <b>{file.name}</b>
        </p>
      </div>
    )}
    {tableData.length > 0 && (
      <div className="data-table" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>{tableHeaders.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tableData.slice(0, 10).map((row, i) => (
              <tr key={i}>
                {tableHeaders.map((h, j) => (
                  <td key={j}>{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default SandboxPanel;