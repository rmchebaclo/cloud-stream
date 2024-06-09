# Container allows for packaging of app and all dependencies into a single image 
# Therefore this image can be run on any machine that has Docker installed and the app will be deployed successfully 

# Multi-stage build (building and running app) to reduce size of the image
# Smaller image because no source files included, only compiled (source files used to build app aren't copied to Stage 2)

# Stage 1: Build

# Use an official Node runtime as a parent image
FROM node:18 AS builder

# Set working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed package specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production 
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

#Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 avaliable outside this container
EXPOSE 3000

# Define the command to run your app using CMD (only one CMD allowed, defines runtime)
CMD [ "npm", "run", "serve" ]
