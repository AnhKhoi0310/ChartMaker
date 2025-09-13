import express from "express";
import multer from "multer";
import path from "path";
import { spawn } from "child_process";
import { generateChartCode } from "../services/openaiService";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../../uploads") });

// In-memory conversation history (per server instance)
let conversationHistory: Array<{ role: 'user' | 'bot', content: string }> = [];
// Chat endpoint: receives prompt and file, returns code and chart
router.post("/chat", upload.single("file"), async (req, res) => {
  console.log("Received /chat request");
  // File
  const file = req.file; // should be defined if file is sent as 'file'
  // Strings
  const message = req.body.message;
  // Arrays/objects (parse from JSON string)
  const columns = JSON.parse(req.body.collumns || "[]");
  const shape = JSON.parse(req.body.shape || "[]");
  const dtypes = JSON.parse(req.body.dtypes || "[]");
  const describe = JSON.parse(req.body.describe || "[]");

  try {
    // Always use the multer-generated filename and construct the path for Docker/cloud
    let filePath = "";
    let fileId = "";
    if (req.file) {
      fileId = req.file.filename; // This is the unique id in uploads
      // Use the actual path where multer saved the file
      filePath = path.join(__dirname, '../../uploads', fileId);
    } else if (req.body.fileName) {
      fileId = req.body.fileName;
      filePath = path.join(__dirname, '../../uploads', fileId);
    } else {
      return res.status(400).json({ error: "No file provided" });
    }

    // Pass the correct filePath to OpenAI and Python

    // Add user prompt to conversation history
    conversationHistory.push({ role: 'user', content: message });

    // Pass conversation history to OpenAI
    // Map to OpenAI format: {role: 'user'|'assistant', content: string}
    const openaiHistory = conversationHistory.map(msg => ({
      role: msg.role === 'bot' ? 'assistant' as const : 'user' as const,
      content: msg.content
    }));

    // Generate code with conversation context
    const code = await generateChartCode(message, columns, shape, dtypes, describe, filePath, openaiHistory);
    console.log("Generated code:", code);

  // Save code to a file for debugging/sandbox display if needed
  const codePath = path.join(__dirname, `../../uploads/${fileId}.py`);
  fs.writeFileSync(codePath, code);

    // The chart should be saved as <fileId>_chart.png (not .py_chart.png)
    const chartPath = path.join(__dirname, `../../uploads/${fileId}_chart.png`);

    // Run the code using spawn, passing the file path as needed
    const pythonProcess = spawn("python3", [codePath]);
    let output = "";
    let errorOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
      console.log("Python output:", data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python error:", data.toString());
    });

    pythonProcess.on("close", (exitCode) => {
      if (exitCode === 0) {
        // Try to return chart image if generated
        let chartImage = null;
        if (fs.existsSync(chartPath)) {
          console.log('Chart image found:', chartPath);
          chartImage = fs.readFileSync(chartPath, { encoding: "base64" });
        } else {
          console.log('Chart image NOT found:', chartPath);
        }
        // Add bot/code output to conversation history
        conversationHistory.push({ role: 'bot', content: code });
        res.json({ code, reply: code, result: output, chartImage });
      } else {
        res.status(500).json({ error: errorOutput });
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;