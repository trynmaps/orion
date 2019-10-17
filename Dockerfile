FROM node:8.6.0

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

CMD [ "npm", "run", "start" ]

# Build
# docker build -t orion .

# Run
# docker run orion:latest
