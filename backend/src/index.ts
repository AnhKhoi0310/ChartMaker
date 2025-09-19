import express, { Request, Response } from "express";
import cors from "cors";
import chartRoutes from "./routes/chartRoutes";
// Create an Express application
const app = express();
// Define the port; fallback to 5000 if not set in environment
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS to allow requests from different origins
app.use(express.json());  // Parse incoming JSON request bodies

app.use("/", chartRoutes); // Mount chart-related routes at root path

app.get("", (req: Request, res: Response) => {
  res.json({ message: "A warm hello from Khoi Tran. Welcome to ChartMaker!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
