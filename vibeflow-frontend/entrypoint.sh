#!/bin/sh
set -ex # Exit on error, print commands

echo "Starting entrypoint script..."
echo "PORT environment variable is: ($PORT)"

# Check if template file exists
if [ ! -f /etc/nginx/nginx.conf.template ]; then
  echo "ERROR: Nginx template file /etc/nginx/nginx.conf.template not found!"
  exit 1
fi
echo "Nginx template file found."

# Substitute environment variables in Nginx configuration
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
echo "--- Substituted Nginx configuration (/etc/nginx/conf.d/default.conf) ---"
cat /etc/nginx/conf.d/default.conf
echo "--- End of Nginx configuration ---"

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
  echo "ERROR: Nginx configuration test failed!"
  exit 1
fi
echo "Nginx configuration test successful."

# Start Nginx
echo "Starting Nginx..."
exec nginx -g 'daemon off;'
