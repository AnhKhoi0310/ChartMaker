import { OpenAI } from "openai";
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
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("Generating chart code with OpenAI...");
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
Always end the code with plt.savefig('${chartPath}') and do not use plt.show().
`;

  // Compose messages for OpenAI
  let messages: Array<{ role: 'user' | 'assistant', content: string }> = [];
  if (conversationHistory && conversationHistory.length > 0) {
    messages = [
      { role: 'user', content: systemPrompt },
      ...conversationHistory
    ];
  } else {
    messages = [
      { role: 'user', content: systemPrompt }
    ];
  }

  const response: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 500,
    temperature: 0.2,
  });

  // Extract code from response
  const code: string = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
    ? response.choices[0].message.content
    : "";
  return code.replace(/```python|```/g, "").trim();
}