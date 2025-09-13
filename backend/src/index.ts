import express, { Request, Response } from "express";
import cors from "cors";
import chartRoutes from "./routes/chartRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", chartRoutes); 

app.get("", (req: Request, res: Response) => {
  res.json({ message: "Hello from ChartMaker!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
