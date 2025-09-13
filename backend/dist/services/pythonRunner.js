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
exports.runPythonCode = runPythonCode;
const python_shell_1 = require("python-shell");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function runPythonCode(code, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Save code to a temp .py file
        const tempCodePath = path_1.default.join(__dirname, "../../tmp/code.py");
        const tempImgPath = path_1.default.join(__dirname, "../../tmp/chart.png");
        fs_1.default.writeFileSync(tempCodePath, code + `\nplt.savefig("${tempImgPath}")\n`);
        return python_shell_1.PythonShell.run(tempCodePath, { pythonOptions: ['-u'] })
            .then(() => {
            // Return image as base64
            const img = fs_1.default.readFileSync(tempImgPath, { encoding: "base64" });
            return "data:image/png;base64," + img;
        })
            .catch((err) => {
            throw err;
        });
    });
}
//# sourceMappingURL=pythonRunner.js.map