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

# Copy the build output from the build stage to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, but good for SPAs)
# To ensure React Router works correctly, we'll add a basic Nginx config.
# Create a file named nginx.conf in the same directory as Dockerfile with:
# server {
#    listen 80;
#    server_name localhost;
#
#    location / {
#        root   /usr/share/nginx/html;
#        index  index.html index.htm;
#        try_files $uri $uri/ /index.html; # Important for SPAs
#    }
#
#    error_page   500 502 503 504  /50x.html;
#    location = /50x.html {
#        root   /usr/share/nginx/html;
#    }
# }
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
