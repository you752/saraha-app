# 🚀 Saraha App API

A secure and scalable backend REST API inspired by the Saraha messaging platform. Users can create accounts, authenticate securely, send anonymous messages, and manage their profiles.

## 📌 Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📧 Email Verification with OTP
- 🔄 Refresh Token Authentication
- 🔑 Password Hashing using bcrypt
- 🗄️ MongoDB with Mongoose
- ⚡ Redis (Upstash) for OTP Storage
- 📤 Anonymous Message Sending
- 💬 Reply to Messages
- 🗑️ Delete Messages
- 🖼️ Profile & Cover Image Upload
- 🛡️ Request Validation using Joi
- 📁 Clean Modular Architecture
- 🌍 RESTful API Design
- ⚠️ Global Error Handling

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis (Upstash)
- JWT
- bcrypt
- Joi
- Multer
- Nodemailer

---

## 📂 Project Structure

```
src
│
├── common
│   ├── middleware
│   ├── response
│   ├── utils
│   └── validation
│
├── database
│   ├── models
│   └── connection
│
├── modules
│   ├── auth
│   ├── user
│   └── message
│
└── main.js
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/you752/saraha-app.git
```

Go to project directory

```bash
cd saraha-app
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=
DATABASE_URL=
SALT=
USER_SIGNATURE=
ADMIN_SIGNATURE=
USER_REFRESH_SIGNATURE=
ADMIN_REFRESH_SIGNATURE=

GOOGLE_ACCOUNT=
PASSWORD_ACCOUNT=

REDIS_URL=
REDIS_TOKEN=
```

Run the project

```bash
npm run dev
```

---

## 📮 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/signup |
| POST | /auth/login |
| POST | /auth/verify |
| POST | /auth/refresh-token |

### User

| Method | Endpoint |
|---------|----------|
| GET | /user/profile |
| PATCH | /user/update-profile |
| PATCH | /user/profile-image |
| PATCH | /user/cover-image |

### Messages

| Method | Endpoint |
|---------|----------|
| POST | /message/send-message |
| GET | /message |
| DELETE | /message/:id |
| POST | /message/reply |

---

## 🔒 Security

- Password hashing using bcrypt
- JWT Access & Refresh Tokens
- OTP Verification
- Redis Expiration
- Request Validation with Joi
- Protected Routes
- Environment Variables
- 
 👨‍💻 Author

Youssef Ahmed
