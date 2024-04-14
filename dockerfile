# Use an official Node.js runtime as the base image
FROM --platform=linux/amd64 node:14

# Set the working directory in the container
WORKDIR /app

ENV REACT_APP_WS_IP="35.240.209.28"
ENV REACT_APP_WS_PORT="8000"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose a port (if needed)
EXPOSE 3000

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]