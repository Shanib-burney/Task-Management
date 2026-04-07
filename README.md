# Task Management REST API

A robust REST API for task management built with Node.js, TypeScript, Express, and Prisma. Features modular architecture with comprehensive testing, linting, and Docker support.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest (Unit & E2E)
- **Linting**: ESLint with TypeScript support
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
├── src/
│   ├── db/
│   │   ├── prisma-client.ts          # Prisma client configuration
│   │   └── generated/                # Auto-generated Prisma client
│   ├── modules/
│   │   ├── project/                  # Project management module
│   │   │   ├── project.controller.ts
│   │   │   ├── project.service.ts
│   │   │   ├── project.repository.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── project.enums.ts
│   │   │   └── project.validators.ts
│   │   ├── team/                     # Team management module
│   │   ├── user/                     # User management module
│   │   └── shared/                   # Shared utilities and middleware
│   │       ├── middlewares/
│   │       │   ├── errorHandler.ts
│   │       │   ├── requestLogger.ts
│   │       │   └── validation.middleware.ts
│   │       └── utils/
│   │           ├── base-repository.ts
│   │           ├── exceptions.ts
│   │           ├── logger.ts
│   │           ├── prisma-error-handler.ts
│   │           └── utils.ts
│   ├── index.ts                      # Application entry point
│   └── routes.ts                     # Route aggregation
├── tests/
│   ├── setup.ts                      # Test setup and configuration
│   ├── e2e/                          # End-to-end tests
│   │   └── setup.ts
│   └── unit/                         # Unit tests
├── prisma/
│   ├── schema.prisma                 # Database schema definition
│   ├── migrations/                   # Database migration files
│   └── config.ts                     # Prisma configuration
├── dist/                             # Compiled JavaScript output
├── coverage/                         # Test coverage reports
├── Dockerfile                        # Docker container configuration
├── docker-compose.yml               # Docker Compose configuration
├── tsconfig*.json                    # TypeScript configurations
├── jest.config.js                    # Jest testing configuration
├── jest.e2e.config.js               # E2E testing configuration
├── eslint.config.js                 # ESLint configuration
└── package.json                      # Project dependencies and scripts
```

## ⚙️ TypeScript Configuration

The project uses a modular TypeScript configuration system with inheritance:

### Base Configuration (`tsconfig.json`)
- **Target**: ES2020 (modern JavaScript features)
- **Module System**: CommonJS (Node.js compatible)
- **Strict Mode**: Enabled for type safety
- **Path Aliases**:
  - `@prisma-client` → `src/generated/prisma/client`
  - `@prisma-client/models` → `src/generated/prisma/models`

### Specialized Configurations

#### Application Build (`tsconfig.app.json`)
- **Purpose**: Production compilation
- **Output**: `./dist` directory
- **Source**: `./src` directory only
- **Excludes**: Test files and node_modules

#### Testing (`tsconfig.test.json`)
- **Purpose**: Unit and integration test compilation
- **Output**: `./dist/tests`
- **Includes**: Both `src/` and `tests/` directories
- **Types**: Includes Jest and Node.js type definitions

#### Linting (`tsconfig.lint.json`)
- **Purpose**: Type-aware linting and type checking
- **No Emit**: Only checks, doesn't generate files
- **Includes**: Source and test files
- **Excludes**: Generated Prisma files

## 🗄️ Database Management (Prisma)

### Prerequisites
- PostgreSQL database running
- Environment variables configured (see `.env-sample`)

### 1. Initial Setup
After cloning and setting up `.env`, sync your database schema:

```bash
npx prisma db push
```

### 2. Generate Prisma Client
Generate TypeScript types for database access:

```bash
npx prisma generate
```

**Note**: This project uses a custom output path (`src/generated/prisma`) for the Prisma client.

### 3. Development Migrations
Create named migrations for schema changes:

```bash
npx prisma migrate dev --name <migration_name>
```

### 4. Production Migrations
Apply migrations in production:

```bash
npx prisma migrate deploy
```

### 5. Database Visualization
Open Prisma Studio for database management:

```bash
npx prisma studio
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Docker (optional, for containerized development)

### 1. Clone and Install
```bash
git clone <repository-url>
cd task-management-rest-api
npm install
```

### 2. Environment Setup
```bash
cp .env-sample .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npm run generate
```

### 4. Development
```bash
# Start development server with hot reload
npm run dev
```

The API will be available at `http://localhost:3000`

## 🐳 Docker Development

### Using Docker Compose
```bash
# Build and start the application
docker compose up --build

# Run in background
docker compose up -d --build

# Stop containers
docker compose down
```

### External Database
If using an external PostgreSQL instance (recommended for production), ensure your `docker-compose.yml` connects to the correct network where PostgreSQL is running.

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
```

### Database
```bash
npm run generate     # Generate Prisma client
```

### Testing
```bash
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Lint code
npm run lint:fix     # Lint and auto-fix issues
npm run type-check   # Type check application code
npm run type-check:test  # Type check test code
npm run type-check:lint  # Type check for linting
```

## 🧪 Testing Strategy

### Unit Tests
- Located in `tests/` directory
- Test individual functions, services, and utilities
- Use Jest with `ts-jest` for TypeScript support
- Mock external dependencies (database, HTTP calls)

### End-to-End Tests
- Located in `tests/e2e/` directory
- Test complete API workflows
- Use real database connections
- Test authentication, validation, and business logic

### Test Configuration
- **Framework**: Jest with TypeScript support
- **Environment**: Node.js
- **Coverage**: Excludes generated files and entry points
- **Setup**: Custom setup files for database and environment

## 🔧 API Endpoints

### Users
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Teams
- `GET /teams` - List teams
- `POST /teams` - Create team
- `GET /teams/:id` - Get team by ID
- `PUT /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team

### Projects
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project by ID
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

## 🏗️ Architecture Patterns

### Modular Architecture
- **Separation of Concerns**: Each module (user, team, project) is self-contained
- **Repository Pattern**: Data access layer abstraction
- **Service Layer**: Business logic implementation
- **Controller Layer**: HTTP request handling

### Shared Utilities
- **Base Repository**: Common database operations
- **Error Handling**: Centralized error management
- **Validation**: Request validation middleware
- **Logging**: Structured logging with Winston

### Type Safety
- **Prisma Generated Types**: Database schema type safety
- **Custom Validators**: Runtime request validation
- **TypeScript Strict Mode**: Compile-time type checking

## 🔒 Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SCHEMA=public

# Application
NODE_ENV=development
PORT=3000

# Prisma
PRISMA_HIDE_PARAMETERS=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

ISC License</content>
<parameter name="filePath">/home/shanib/d-drive/node js/task management/Rest-API/README.md
