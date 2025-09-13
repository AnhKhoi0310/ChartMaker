import React, { useState } from "react";
import Split from "react-split";
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
      
      const res = await axios.post("https://chart-maker-khoi-5097fe99ba12.herokuapp.com/chat", formData, {
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

  // Responsive: horizontal split for desktop, vertical for mobile
  const isMobile = window.innerWidth < 900;

  return (
    <Split
      direction={isMobile ? "vertical" : "horizontal"}
      sizes={[33, 34, 33]}
      minSize={isMobile ? [150, 150, 150] : [200, 200, 200]}
      expandToMin={true}
      gutterSize={8}
      className="dashboard-container split-root"
      style={{ height: "100vh", width: "100vw" }}
    >
  <div style={{ height: "100%", minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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
      </div>
  <div style={{ height: "100%", minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <ChartPanel chartImage={chartImage} />
      </div>
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'auto' }}>
        <ChatPanel messages={messages} onSend={handleSend} />
        {notebookCode && (
          <div style={{ background: '#e3f0ff', borderRadius: 8, padding: 16, boxShadow: '0 1px 6px rgba(0,40,120,0.04)', marginTop: 16 }}>
            <h3 style={{ color: '#2a4d7a', marginBottom: 8 }}>Generated Jupyter Code</h3>
            <textarea
              value={notebookCode}
              onChange={e => setNotebookCode(e.target.value)}
              style={{ width: '100%', minHeight: 200, fontFamily: 'monospace', fontSize: 14, borderRadius: 8, border: '1px solid #c7e0ff', background: '#f8fbff', color: '#2a4d7a', padding: 12, resize: 'vertical' }}
            />
          </div>
        )}
      </div>
    </Split>
  );
}

export default App;
