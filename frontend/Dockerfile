# Use a Node.js image for development
FROM node:16.20.1

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start"]