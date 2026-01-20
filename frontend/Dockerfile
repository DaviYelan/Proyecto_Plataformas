# Multi-stage build: Build React frontend, then serve with Flask
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Runtime image with Python/Flask
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask application
COPY src ./src
COPY --from=build /app/dist ./src/aventurabus_dist

# Set environment variables
ENV FLASK_APP=src.app:create_app
ENV PYTHONUNBUFFERED=1

# Expose Flask port
EXPOSE 5000

# Run Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
