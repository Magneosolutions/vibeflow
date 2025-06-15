# Stage 1: Build the React application
FROM node:20-alpine AS build

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Declare build argument that will be passed from Cloud Build
ARG VITE_API_BASE_URL_ARG
# Set environment variable for the build process from the build argument
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL_ARG

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies with retry logic and increased timeout
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm config set loglevel verbose && \
    npm install --no-audit --prefer-offline || \
    (npm cache clean --force && npm install --no-audit)

# Copy the rest of the application code
COPY . .

# Add a build argument to break cache for npm run build
ARG CACHEBUST=1
RUN echo "Cache bust: ${CACHEBUST}"
# Build the application
# VITE_API_BASE_URL will now be available to this command
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the build output from the build stage to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# The PORT environment variable will be set by Cloud Run.
# Nginx will be configured by entrypoint.sh to listen on this port.

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
