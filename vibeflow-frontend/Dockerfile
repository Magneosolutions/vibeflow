# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
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
