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
const openai_1 = require("openai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateChartCode(message, columns, shape, dtypes, describe, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("Generating chart code with OpenAI...");
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
Always end the code with plt.savefig('${chartPath}') and do not use plt.show().
`;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: systemPrompt }
            ],
            max_tokens: 500,
            temperature: 0.2,
        });
        // Extract code from response
        const code = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
            ? response.choices[0].message.content
            : "";
        return code.replace(/```python|```/g, "").trim();
    });
}
//# sourceMappingURL=openaiService.js.map