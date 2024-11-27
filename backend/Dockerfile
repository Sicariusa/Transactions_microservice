FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000


# Set environment variables with default values
ENV DB_HOST=freedb-transactions-microservices1232.f.aivencloud.com
ENV DB_PORT=15139
ENV DB_USER=avnadmin
ENV DB_PASSWORD=AVNS_P-FFozRiebO0FKzdXNH
ENV DB_DATABASE=Transactions

# Command to run the application
CMD ["npm", "run", "start:prod"]