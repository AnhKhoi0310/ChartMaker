import React, { useState } from "react";
import SandboxPanel from "./components/SandboxPanel";
import ChartPanel from "./components/ChartPanel"; 
import ChatPanel from "./components/ChatPanel";
import axios from "axios";
import "./styles/Dashboard.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [collumns, setColumns] = useState<string[]>([]);
  const [shape, setShape] = useState<string[]>([]);
  const [dtypes, setDtypes] = useState<string[]>([]);
  const [describe, setDescribe] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [notebookCode, setNotebookCode] = useState<string>("");
  const [chartImage, setChartImage] = useState<string>("");

  const handleFileUpload = (selectedFile: File, data: any[], headers: string[],collumns: string[], shape :string[], dtypes:string[], describe: string[]) => {
    setFile(selectedFile);
    setTableData(data);
    setTableHeaders(headers);
    setColumns(collumns);
    setShape(shape);
    setDtypes(dtypes);
    setDescribe(describe);  
    setSummary(""); // Clear summary until backend returns it
  };

  const handleSend = async (msg: string) => {
    setMessages(prev => [...prev, { sender: "user", text: msg }]);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("message", msg);
      formData.append("collumns", JSON.stringify(collumns));
      formData.append("shape", JSON.stringify(shape));
      formData.append("dtypes", JSON.stringify(dtypes));
      formData.append("describe", JSON.stringify(describe));
      
      const res = await axios.post("http://localhost:5000/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
      setNotebookCode(res.data.code || "");
      if (res.data.chartImage) {
        setMessages(prev => [...prev, { sender: "bot", text: "chart received." }]);
        setChartImage(res.data.chartImage);
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: "chart not received." }]);
      }
      setChartImage(res.data.chartImage || "");
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "Error from backend." }]);
    }
  };

  return (
    <div className="dashboard-container">
      <SandboxPanel
        file={file}
        tableHeaders={tableHeaders}
        tableData={tableData}
        columns={collumns}
        shape={shape}
        dtypes={dtypes}
        describe={describe}
        summary={summary}
        notebookCode={notebookCode}
        onFileUpload={handleFileUpload}
        setNotebookCode={setNotebookCode}
      />
      <ChartPanel chartImage={chartImage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatPanel messages={messages} onSend={handleSend} />
        {notebookCode && (
          <div style={{  background: '#e3f0ff', borderRadius: 8, padding: 16, boxShadow: '0 1px 6px rgba(0,40,120,0.04)' }}>
            <h3 style={{ color: '#2a4d7a', marginBottom: 8 }}>Generated Jupyter Code</h3>
            <textarea
              value={notebookCode}
              onChange={e => setNotebookCode(e.target.value)}
              style={{ width: '100%', minHeight: 400, fontFamily: 'monospace', fontSize: 14, borderRadius: 8, border: '1px solid #c7e0ff', background: '#f8fbff', color: '#2a4d7a', padding: 12, resize: 'vertical' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
