# ---- Backend + Python only (no frontend) ----
FROM node:20-bullseye-slim

WORKDIR /app

# Install Python and system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Install Python dependencies
WORKDIR /app
COPY python/requirement.txt ./python/requirement.txt
RUN pip3 install -r python/requirement.txt

# Copy backend source and tsconfig
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm install
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
