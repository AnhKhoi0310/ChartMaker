import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


export async function generateChartCode(
  message: string,
  columns: string[],
  shape: [number, number],
  dtypes: Record<string, string>,
  describe: Record<string, any>,
  filePath: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant', content: string }> // A list of previous messages 
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  console.log("Generating chart code with Gemini...");
  // Read the first few rows of the file to get schema
  const ext: string = path.extname(filePath).toLowerCase();
  let schema: string = "";
  if (ext === ".csv") {
    const content: string = fs.readFileSync(filePath, "utf8");
    schema = content.split("\n").slice(0, 6).join("\n");
  } else if (ext === ".xlsx") {
    schema = "XLSX file uploaded (schema extraction not shown here)";
  }
  console.log("file path", filePath);
  // Always save the chart as a PNG and do not use plt.show()
  const chartPath = filePath + '_chart.png';

  const systemPrompt: string = `
Write a Python code snippet (without any explanation or comment) using matplotlib or seaborn to generate a chart based on the following request: ${message}.
The data file is located at: '${filePath}'. The data has the following columns: ${columns.join(", ")}.
The data shape is: [${shape.join(", ")}].
The data types are: ${JSON.stringify(dtypes)}.
The statistical description of the data is: ${JSON.stringify(describe)}.

Requirements:
1. Always end the code with plt.savefig('${chartPath}') and do not use plt.show().
2. Use modern seaborn API - if using palette without hue, assign the variable to hue parameter instead.
3. Import necessary libraries: import pandas as pd, import matplotlib.pyplot as plt, import seaborn as sns, import numpy as np (as needed).
4. Read the CSV file with pd.read_csv() and handle the file path correctly.
5. Do not include any explanations or comments in the code.
`;
  // console.log("System prompt for Gemini:", systemPrompt);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  // Prepare history for Gemini chat
  const history = conversationHistory ? conversationHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  })) : [];
  // console.log("Conversation history for Gemini:", history);
  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(systemPrompt);
  console.log("code result:", result);
  const code = result.response.text();

  return code.replace(/```python|```/g, "").trim();
}