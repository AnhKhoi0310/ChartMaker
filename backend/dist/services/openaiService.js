"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChartCode = generateChartCode;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateChartCode(message, columns, shape, dtypes, describe, filePath, conversationHistory // A list of previous messages 
) {
    return __awaiter(this, void 0, void 0, function* () {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        console.log("Generating chart code with Gemini...");
        // Read the first few rows of the file to get schema
        const ext = path_1.default.extname(filePath).toLowerCase();
        let schema = "";
        if (ext === ".csv") {
            const content = fs_1.default.readFileSync(filePath, "utf8");
            schema = content.split("\n").slice(0, 6).join("\n");
        }
        else if (ext === ".xlsx") {
            schema = "XLSX file uploaded (schema extraction not shown here)";
        }
        console.log("file path", filePath);
        // Always save the chart as a PNG and do not use plt.show()
        const chartPath = filePath + '_chart.png';
        const systemPrompt = `
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
        const result = yield chat.sendMessage(systemPrompt);
        console.log("code result:", result);
        const code = result.response.text();
        return code.replace(/```python|```/g, "").trim();
    });
}
//# sourceMappingURL=openaiService.js.map