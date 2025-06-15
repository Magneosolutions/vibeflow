# Use an official Node.js runtime as a parent image (Alpine for smaller size)
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install app dependencies
# Using npm ci for cleaner installs, and --only=production for builder stage might be an option
# but for simplicity and to ensure devDeps are available for tsc, we install all first.
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json again for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# The application listens on the port defined by the PORT environment variable.
# Google Cloud Run will set this variable. Default to 3001 if not set.
# Our Express app in src/index.ts should be configured to use process.env.PORT.
# No EXPOSE instruction is strictly necessary for Cloud Run as it handles port mapping.

# Define the command to run the application
CMD [ "node", "dist/index.js" ]
