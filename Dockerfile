# Use official Node.js Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose port
EXPOSE 3000

# Run the server
CMD [ "node", "server.js" ]
