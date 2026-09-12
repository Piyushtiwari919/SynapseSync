# SynapseSync

SynapseSync is a scalable, real-time social media platform designed for seamless user interaction, dynamic content sharing, and instant messaging. Built with a decoupled microservices-inspired architecture, it leverages a highly optimized MERN stack with persistent WebSocket connections for low-latency communication.

## 🚀 System Architecture

The application is deployed across a distributed infrastructure to ensure high availability and strict security separation between the client and server:

* **Frontend Client:** Served globally via **Vercel's Edge Network** for sub-millisecond CDN caching and optimal React (Vite) rendering.
* **Backend API:** Containerized using **Docker** and hosted on an **AWS EC2 (Ubuntu)** instance.
* **Reverse Proxy:** Traffic is routed through **Nginx** with automatic SSL encryption handled by Let's Encrypt (Certbot).
* **Database:** Fully managed **MongoDB Atlas** cluster for robust data persistence and automated backups.

## ✨ Core Features

* **Real-Time Bi-directional Communication:** Instant messaging and live feed updates powered by Socket.io.
* **Enterprise-Grade Authentication:** Stateless JWT architecture utilizing secure, `httpOnly`, `SameSite=None` cross-domain cookies with silent token refreshing.
* **Two-Factor Verification:** Secure email-based OTP verification for account creation and recovery using Nodemailer.
* **Media Management:** Direct-to-cloud image uploads and transformations handled via the Cloudinary API and Multer.
* **Responsive UI:** Utility-first CSS styling via Tailwind CSS and DaisyUI components for a native feel across all device sizes.

## 💻 Tech Stack

| Domain | Technologies Utilized |
| :--- | :--- |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, DaisyUI, Axios |
| **Backend** | Node.js, Express.js, Socket.io, JWT, bcrypt, Validator |
| **Database & Cloud** | MongoDB Atlas, Cloudinary, AWS EC2 |
| **DevOps & Tooling** | Docker, Nginx, Let's Encrypt, Git, ESLint |

## 🛠️ Local Development Setup

### 1. Prerequisites

Ensure you have the following installed on your local machine:
* Node.js (v18 or higher)
* Docker Desktop (optional, for isolated backend execution)
* MongoDB Atlas Account
* Cloudinary Account

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/synapsesync.git
cd synapsesync
```

### 3. Environment Variables

Create a `.env` file in the root of your `backend` directory and configure the following variables. *Do not use quotes or trailing spaces.*

| Variable | Description | Example |
| :--- | :--- | :--- |
| PORT | Local backend port | 5000 |
| FRONTEND_URL | Allowed CORS origin | http://localhost:5173 |
| MONGO_URL | MongoDB connection string | mongodb+srv://user:pass@cluster... |
| JWT_SECRET_KEY | Cryptographic key for tokens | your_secure_random_string |
| JWT_ACCESS_TOKEN_EXPIRY_TIME | Lifespan of access token | 2h |
| JWT_REFRESH_TOKEN_EXPIRY_TIME | Lifespan of refresh token | 7d |
| CLOUDINARY_CLOUD_NAME | Cloudinary identifier | dcl25... |
| CLOUDINARY_API_KEY | Cloudinary access key | 123456789... |
| CLOUDINARY_API_SECRET | Cloudinary secret key | abc123def... |
| EMAIL_ID | SMTP sender email | admin@synapsesync.com |
| NODE_MAILER_APP_PASSWORD | App-specific SMTP password | abcd efgh ijkl mnop |

Create a `.env` file in the root of your `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Initialization

**Start the Backend API:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend Client (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 Author

**Piyush Tiwari**
* Full-Stack Software Engineer
* Focused on scalable backend architecture, real-time data engineering, and seamless web experiences.

---
Developed for production scalability and real-time connectivity.
