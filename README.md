# User Profile Management System (MERN)

A robust full-stack application for managing user profiles, built specifically as a practical exercise to master **Dockerization** and **Containerization**. This project demonstrates professional-grade implementation standards using Node.js, Express, MongoDB, and Vanilla JavaScript, while serving as a foundation for learning how to orchestrate multi-container environments with **MongoDB** and **Mongo-Express**.

## 🚀 Key Implementations & Standards

### 1. Backend Architecture (Node.js & Express)
*   **Centralized Error Handling**: Implemented a custom `ApiError` class and a global `errorHandler` middleware. This ensures consistent error responses (JSON format with status codes) across the API, separating operational errors from programming bugs.
*   **Async Middleware**: Utilized an `asyncHandler` wrapper to eliminate repetitive `try-catch` blocks in controllers, keeping the codebase clean and readable.
*   **Automated Data Seeding**: Implemented a smart seeding script (`ensureDefaultUser.js`) that executes on server startup. It detects if the database is empty and automatically migrates a default user profile, including a profile picture.
*   **Image Handling Strategy**: 
    *   Transformed the image upload process to use **Base64 encoding**.
    *   Images are processed in-memory using `multer`, converted to Base64 strings, and stored directly in the MongoDB `User` document.
    *   **Benefit**: This makes the application stateless regarding file storage, simplifying containerization (Docker) and deployment since no persistent volume is strictly required for user avatars.
*   **Schema Validation**: The Mongoose `User` model includes strict validation rules (required fields, regex patterns for email, trimming) to ensure data integrity at the database level.

### 2. Frontend Architecture
*   **Separation of Concerns**:
    *   **Structure**: `index.html` handles only the semantic markup.
    *   **Presentation**: `style.css` manages theming using CSS variables and modern Flexbox layouts.
    *   **Logic**: `app.js` encapsulates all business logic, API interactions, and DOM manipulation.
    *   **Configuration**: `config.js` isolates environment-specific variables (like API URLs) from the core logic.
*   **User Experience**: 
    *   Implemented a "View" vs "Edit" mode toggle, allowing users to modify their profile inline without page reloads.
    *   Dynamic rendering of Base64 images directly from the database response.

## 🛠️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection logic
│   │   ├── controllers/    # Request handlers (Business logic)
│   │   ├── middleware/     # Error handling, Upload processing
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── seed/           # Data migration/seeding scripts
│   │   ├── utils/          # Helper classes (ApiError)
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── app.js              # Frontend logic
│   ├── config.js           # API Configuration
│   ├── index.html          # Main view
│   └── style.css           # Styles
├── mongo.yaml
└── README.md
```

## 🐳 Docker Environment Setup

This project uses Docker to manage the database infrastructure, ensuring a consistent environment.

### Option 1: Docker Compose (Recommended)

Start both MongoDB and Mongo-Express with a single command using the provided `mongo.yaml` file.

```bash
docker-compose -f mongo.yaml up -d
```

### Option 2: Manual Setup

If you prefer to run containers manually, follow these steps:

#### 1. Create a Docker Network

Create an isolated network to allow containers to communicate securely.

```bash
docker network create mern-network
```

#### 2. Start MongoDB Container

Run the MongoDB container attached to the network.

```bash
docker run -d \
  --name mongo \
  --network mern-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=12345678 \
  mongo
```

#### 3. Start Mongo-Express Container

Run Mongo-Express (Database GUI) to visualize and manage your data.

```bash
docker run -d \
  --name mongo-express \
  --network mern-network \
  -p 8081:8081 \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=12345678 \
  -e ME_CONFIG_MONGODB_URL=mongodb://admin:12345678@mongo:27017/ \
  mongo-express
```

### Verify & Access

1. **Check Containers**: Ensure both containers are running.

   ```bash
   docker ps
   ```

2. **Access Mongo-Express**: Open [http://localhost:8081](http://localhost:8081) in your browser.
   * Login with `admin` / `12345678`.
   * Once the application runs and seeds data, you can explore the `user_account` database here.

## 🏃‍♂️ How to Run

1. **Prerequisites**:
   * Node.js installed.
   * MongoDB running locally or accessible via connection string.

2. **Configuration**:
   * Ensure the `backend/.env` file is configured with your MongoDB connection string:

     ```env
     PORT=5000
     MONGO_URL=mongodb://localhost:27017/user_account
     ```

3. **Start the Application**:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Access**:
   * Open your browser and navigate to `http://localhost:5000`.
   * The application serves the frontend statically from the backend.
