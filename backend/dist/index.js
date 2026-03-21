"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chartRoutes_1 = __importDefault(require("./routes/chartRoutes"));
// Create an Express application
const app = (0, express_1.default)();
// Define the port; fallback to 5000 if not set in environment
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)()); // Enable CORS to allow requests from different origins
app.use(express_1.default.json()); // Parse incoming JSON request bodies
app.use("/", chartRoutes_1.default); // Mount chart-related routes at root path
app.get("", (req, res) => {
    res.json({ message: "A warm hello from Khoi Tran. Welcome to ChartMaker!" });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map