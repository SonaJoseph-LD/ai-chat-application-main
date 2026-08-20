FROM node:20-alpine
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lock and package definition
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Set build-time environments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
RUN pnpm build

EXPOSE 3000

# Start production server
CMD ["pnpm", "start"]
