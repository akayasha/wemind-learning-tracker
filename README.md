# 📚 Learning Tracker API (NestJS)

A RESTful API built with **NestJS** to help users track their learning sessions, analyze progress, and stay consistent.

---

## 🚀 Features

- ✅ Create users
- ✅ Record learning sessions
- ✅ List sessions
- ✅ Get total duration per topic (summary)
- ✅ Calculate current streak of consecutive learning days
- ✅ Generate insights for dashboards or notifications (optional)

---

## 📈 Scaling Considerations

### If this platform scales to 100k users:

**🧠 How would you handle streak calculation without slowing the system?**
- Index critical fields (`userId`, `date`) in the database.
- Cache streaks per user using Redis or similar.
- Use background jobs to recalculate when sessions are created or updated.

**⚡ Would you compute it live or cache it? Why?**
- Cache it for fast access and scalability.
- Recompute live **only** when necessary (like when a new session is recorded or queried after a long time).
- Cached approach balances performance with data accuracy.

**🌞 If a product manager says, “We want the streak calculation to be real-time, but only during daytime hours,” how would you design that?**
- Use a scheduler (e.g., with `@nestjs/schedule`) to update streaks **between 6 AM - 10 PM**.
- Outside those hours, serve streaks from cache.
- Optionally use a flag to switch between live/cached mode based on the time.

---

## 🛠 Handling Data Integrity

### Duplicate learning sessions in DB

**🛡️ Prevention:**
- Use a unique constraint on `userId + topic + timestamp` if appropriate.
- Implement idempotent POST request logic using client-generated UUID or request hash.

**🧹 Resolution:**
- Run a cleanup script:
    - Identify duplicates using `GROUP BY` + `HAVING COUNT > 1`.
    - Keep the earliest/latest record and delete others.

---

## 📦 Installation

```bash
git clone https://github.com/akayasha/wemind-learning-tracker.git
cd learning-tracker-api
npm install
npm install @nestjs/swagger swagger-ui-express
cp .env.example .env
# Set up your database in .env
npm run start:dev
```

---

# 📚 API Documentation
- [Swagger UI](http://localhost:3000/api-docs)


---

 ## 🔌 API Endpoints

| Method | Endpoint     | Description                     |
|--------|--------------|---------------------------------|
| POST   | /users       | Create a new user               |
| POST   | /sessions    | Record a learning session       |
| GET    | /sessions    | List all sessions               |
| GET    | /summary     | Get total duration per topic    |
| GET    | /streak      | Get current learning streak     |



---

# 📚 Tech Stack

- NestJS
- PostgreSQL / MySQL (or another relational DB)
- TypeORM / Prisma
- Redis (optional for caching)
- Docker (optional for containerization)


---

## Notes on ESLint

ESLint has been turned off for this project. If you wish to enable it, you can do so by updating the configuration in the `.eslintrc` file or by reinstalling the necessary ESLint dependencies.

### Reason for Disabling ESLint
ESLint was disabled because it significantly slowed down task completion due to the time required to address linting errors and warnings, which were not critical to the functionality of the project during development.

### How to Re-enable ESLint
1. Install ESLint dependencies:
   ```bash
   npm install eslint --save-dev
   

# 🧪 Testing
```bash
npm run test
```

## 🧪 Testing API with cURL & Postman

### 📌 Create a New User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```
### 📝 Record a Learning Session

``` bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid-of-user",
    "topic": "Math",
    "duration": 60,
    "date": "2025-04-10"
  }'

```

### 📜 List All Sessions

```bash
curl http://localhost:3000/sessions
```

### 📊 Get Total Duration per Topic

```bash
curl http://localhost:3000/sessions
```

### 📅 Get Current Streak

```bash
curl --location 'http://localhost:3000/users/8f275bb3-f922-4fb7-a8c4-c9e6e3c5e3db/streak'
```

### 📅 Get Insights

```bash
curl --location 'http://localhost:3000/users/8f275bb3-f922-4fb7-a8c4-c9e6e3c5e3db/insights'
```





