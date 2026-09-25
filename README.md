# Community Health Camp Portal
> **TAGLINE:** Find. Register. Stay Healthy.

---

## 1. Project Overview & Problem Statement
In many local communities, information regarding free health camps organized by hospitals, NGOs, government institutions, and local charity groups is scattered across posters, local newspapers, social media, and WhatsApp groups. Many individuals—especially in rural and semi-urban areas—miss out on vital free medical care simply due to a lack of awareness and fragmented information.

The **Community Health Camp Portal** brings all local health camp discovery, details, and slot registration into a single, accessible, and user-friendly platform.

---

## 2. Proposed Solution
This portal allows citizens to:
- Easily search and filter upcoming free health camps by location, camp type, or date.
- View complete bilingual details (English and Telugu) regarding health check-ups, services offered, dates, times, and venue addresses.
- Instantly register for a health camp without needing an account and receive a printable Registration Pass.
- Enable health organizers and administrators to securely manage health camps and view real-time citizen registration metrics.

---

## 3. Key Features
- **Bilingual Interface (English & Telugu)**: Toggle UI language without reloading the page. Language selection persists across browser sessions using `localStorage`.
- **Bilingual Camp Content**: Admin can supply camp names, descriptions, and services offered in both English and Telugu.
- **Citizen Registration Pass**: Instant generation of a unique `REG-XXXXXX` registration ID and a clean printable pass (`window.print()`).
- **Duplicate & Capacity Safeguards**: Prevents duplicate registration for the same camp using the same mobile number, and automatically disables registration when the maximum participant limit is reached.
- **Admin Management Portal**: Secure JWT authentication for admins to Add, Edit, Delete, or Cancel camps, and review citizen registrations.
- **Out-Of-The-Box Execution**: Intelligent database layer connects to local MongoDB or automatically starts an in-memory MongoDB instance (`mongodb-memory-server`) if local MongoDB is not running.

---

## 4. User Roles
1. **Citizen**:
   - Discover health camps.
   - Search & filter by location, category, date.
   - View detailed services & organizer contacts.
   - Register and print confirmation pass.
   - Switch language (English / Telugu).
2. **Admin**:
   - Secure login using JWT.
   - View analytics dashboard (Upcoming, Completed, Registrations, Active).
   - CRUD operations for health camps.
   - Cancel health camps.
   - View and search all registered citizens.

---

## 5. Technology Stack
- **Frontend**: React.js, React Router DOM, Lucide Icons, Vite, Custom CSS Design System
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose (with in-memory fallback)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for password hashing

---

## 6. Multi-Language System
UI text is stored in modular translation dictionaries:
- `client/src/translations/en.json`
- `client/src/translations/te.json`

The app uses `LanguageContext` to provide instant UI text switching and fallback to English if Telugu content for specific organizer fields is unavailable.

---

## 7. Database Models
- **Admin**: `username`, `password` (bcrypt hashed), `createdAt`
- **HealthCamp**: `campNameEnglish`, `campNameTelugu`, `organizerName`, `campType`, `date`, `startTime`, `endTime`, `location`, `address`, `descriptionEnglish`, `descriptionTelugu`, `servicesEnglish`, `servicesTelugu`, `contactNumber`, `maxParticipants`, `status`, `createdAt`, `updatedAt`
- **Registration**: `registrationId`, `campId` (Ref to HealthCamp), `fullName`, `age`, `gender`, `mobileNumber`, `address`, `registeredAt`

---

## 8. Demo Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

---

## 9. API Endpoints
### Public APIs
- `GET /api/camps` - Get all camps with live slot metrics.
- `GET /api/camps/upcoming` - Get upcoming camps.
- `GET /api/camps/:id` - Get specific camp details.
- `POST /api/camps/:id/register` - Register citizen for camp.

### Admin APIs (JWT Protected)
- `POST /api/admin/login` - Admin login.
- `GET /api/admin/camps` - Get camps list for admin.
- `POST /api/admin/camps` - Create new camp.
- `PUT /api/admin/camps/:id` - Update existing camp.
- `DELETE /api/admin/camps/:id` - Delete camp.
- `PUT /api/admin/camps/:id/cancel` - Cancel health camp.
- `GET /api/admin/registrations` - Get all citizen registrations.

---

## 10. How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm

### Step 1: Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### Step 2: Start Backend Server
```bash
cd server
npm start
```
*Backend will run on http://localhost:5000*

### Step 3: Start Frontend Client
```bash
cd client
npm run dev
```
*Frontend will run on http://localhost:3000*

---

## 11. Folder Structure
```
CSP/
├── .env.example
├── README.md
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── translations/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 12. Future Scope
- SMS alert notifications for registered citizens before the camp date.
- QR code scanning for fast on-site verification at health camp check-in counters.
- Additional regional language support (Hindi, Tamil, Kannada).
