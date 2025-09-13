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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const openaiService_1 = require("../services/openaiService");
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, "../../uploads") });
// Chat endpoint: receives prompt and file, returns code and chart
router.post("/chat", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            filePath = path_1.default.join(__dirname, '../../uploads', fileId);
        }
        else if (req.body.fileName) {
            fileId = req.body.fileName;
            filePath = path_1.default.join(__dirname, '../../uploads', fileId);
        }
        else {
            return res.status(400).json({ error: "No file provided" });
        }
        // Pass the correct filePath to OpenAI and Python
        const code = yield (0, openaiService_1.generateChartCode)(message, columns, shape, dtypes, describe, filePath);
        console.log("Generated code:", code);
        // Save code to a file for debugging/sandbox display if needed
        const codePath = path_1.default.join(__dirname, `../../uploads/${fileId}.py`);
        fs_1.default.writeFileSync(codePath, code);
        // Run the code using spawn, passing the file path as needed
        const pythonProcess = (0, child_process_1.spawn)("python3", [codePath]);
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
                const chartPath = codePath + '_chart.png';
                let chartImage = null;
                if (fs_1.default.existsSync(chartPath)) {
                    chartImage = fs_1.default.readFileSync(chartPath, { encoding: "base64" });
                }
                res.json({ code, reply: code, result: output, chartImage });
            }
            else {
                res.status(500).json({ error: errorOutput });
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
exports.default = router;
//# sourceMappingURL=chartRoutes.js.map