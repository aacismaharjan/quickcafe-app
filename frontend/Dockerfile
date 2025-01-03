# Use a Node.js image to build the project
FROM node:16 AS build

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build


# Use a lightweight Nginx image for production
FROM nginx:1.21-alpine

# Copy the build files to the Nginx directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
