# Use the latest LTS version of Node.js
FROM node:20-alpine
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
 
# Install dependencies
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm install streaming-availability
RUN npm install firebase
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 3000
 
# Define the command to run your app
CMD ["npm", "start"]