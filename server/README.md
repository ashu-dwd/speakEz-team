# SpeakEz Server

Node.js/Express server for the SpeakEz language learning and interview practice platform.

## Features

- **AI-Powered Interview Assessment**: Google Gemini integration for detailed interview analysis
- **Real-time Communication**: Socket.IO for live interview sessions
- **User Management**: JWT-based authentication and user profiles
- **File Uploads**: Support for avatar and character images
- **Comprehensive API**: RESTful endpoints for all features

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **AI**: Google Gemini AI
- **Package Manager**: pnpm
- **Container**: Docker

## Quick Start

### Local Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd server
   pnpm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or install MongoDB locally
   ```

4. **Run the server:**
   ```bash
   pnpm run dev  # Development with hot reload
   # or
   pnpm start    # Production mode
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t speakez-server .
docker run -p 5000:5000 speakez-server
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout

### Interview Practice

- `GET /api/interviews/preferences` - Get user preferences
- `PUT /api/interviews/preferences` - Update preferences
- `POST /api/interviews` - Create interview session
- `PUT /api/interviews/:id/start` - Start interview
- `PUT /api/interviews/:id/end` - End interview
- `GET /api/interviews/:id/assessment` - Get AI assessment

### User Data

- `GET /api/userData/profile` - Get user profile
- `PUT /api/userData/profile` - Update profile

### AI Characters

- `GET /api/aiChar` - List AI characters
- `POST /api/aiChar` - Create AI character

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run test:coverage

# Run specific test file
pnpm test -- __tests__/userRoute.test.js
```

## Deployment

### GitHub Actions CI/CD

The repository includes GitHub Actions workflows for automated deployment:

- **Staging**: Deploys on pushes to `develop` branch
- **Production**: Deploys on pushes to `main` branch

### Manual Deployment

1. **Server Setup:**

   ```bash
   # Install Node.js and pnpm
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   source ~/.bashrc

   # Install PM2 for process management
   npm install -g pm2

   # Clone repository
   git clone <repository-url>
   cd server

   # Install dependencies
   pnpm install --prod
   ```

2. **Environment Configuration:**

   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Database Setup:**

   ```bash
   # Install MongoDB or use MongoDB Atlas
   # Update MONGO_URI in .env
   ```

4. **Start Application:**

   ```bash
   # Using PM2
   pm2 start ecosystem.config.js

   # Or using systemd
   sudo cp speakez-server.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl start speakez-server
   sudo systemctl enable speakez-server
   ```

### Docker Production Deployment

```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

- **Health Checks**: `GET /health` endpoint
- **Logs**: Application logs are written to stdout/stderr
- **Metrics**: Basic uptime and performance metrics available

## Security

- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (configurable)
- Security headers middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

[Your License Here]
