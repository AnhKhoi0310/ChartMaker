GPT-Powered Chart Maker

This project lets users type prompts, GPT generates Python code, and the code runs to make charts — all served on a web app. Think of it as your own AI chart generator.

🎯 How It Works

Frontend (TS)
Users input the dataset file

Users type in prompts for the chart they want

Sends the prompt to the backend via API

Backend (Express + TypeScript)

Receives the prompt

Calls GPT API to generate Python code based on the prompt

Runs the Python code in a sandboxed process (isolated per user)

Returns results (chart image, CSV, or text output) back to the frontend

Python Runner

Either runs the code directly in memory (python -c "code") or writes it to a temporary script.py file

Executes the code and saves results (charts/images)

Sends output back to Express API

Docker

I use a single Docker container for simplicity

Container has Node.js + Python installed

Frontend is built and served via Express backend

Python runs inside the same container, so don’t need separate servers

Concurrency

Each user request spawns a fresh Python process

This keeps users isolated — nobody interferes with anyone else’s code

🛠 Setup
1. Clone the repo
git clone <repo-url>
cd project

2. Backend setup
cd backend
npm install


Make sure tsconfig.json is set up

Build the backend:

npm run build

3. Frontend setup
cd frontend
npm install
npm run build


Build output will be copied into backend/public in Docker

4. Python dependencies

Make sure you have a requirements.txt with:

matplotlib
pandas
numpy
seaborn

🚀 Run with Docker

From the root project folder:

docker build -t gpt-chart-app .
docker run -p 3000:3000 gpt-chart-app


Frontend served on http://localhost:3000

API endpoint /run-python runs GPT-generated Python code

💡 Future Improvements

Add sandboxing for Python for extra safety

Multi-container setup for better scaling

Save user history of charts (Create database, authentication)

User can interact with the sandbox. 
<img width="813" height="395" alt="image" src="https://github.com/user-attachments/assets/1ee47333-946c-4f81-a6f5-736a7d8922aa" />
