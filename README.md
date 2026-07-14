# Event Management System (MyYard)

A full-stack Event Management platform that allows users to discover events, purchase tickets, and manage their bookings, while providing event organizers (Admins) with powerful tools to create events and validate/scan attendee tickets securely.

## 🌟 Key Features
- **User Workflow:** Browse upcoming events, view pricing tiers, purchase tickets, and view your tickets with unique QR codes.
- **Admin Dashboard:** Create new events, manage ticket inventory, and validate attendee tickets.
- **Ticket Security:** Each ticket is generated with a unique ID and QR code, preventing duplicate entries.

---

## 🔄 The Workflow

### 1. Booking a Ticket (User)
1. The user logs in and browses the **Home** page for upcoming events.
2. They select an event, choose a ticket tier (e.g., VIP, General Admission), and select the quantity.
3. Upon clicking "Buy Tickets", the system generates a secure ticket record in the database.
4. The user can go to their **My Tickets** page to view their purchased tickets. Each ticket displays a unique **QR Code**.

### 2. Event Day & Ticket Verification (Admin/Organizer)
1. When an attendee arrives at the event, they present the **QR Code** from their "My Tickets" page on their phone.
2. An Admin (organizer) logs into the platform and navigates to the **Admin Dashboard**.
3. **To verify the ticket:**
   - The Admin can scan the user's QR Code (which contains the unique Ticket ID).
   - The system sends a `PUT` request to `/api/tickets/validate/:id` on the backend.
4. **Validation Logic:**
   - If the ticket is valid, its status is updated to `"used"`, and the attendee is granted entry.
   - If the ticket has *already been scanned*, the system will block entry and return an error: `"Ticket has already been used!"`.
   - If the ticket was cancelled, it will return: `"Ticket was cancelled!"`.

---

## 🚀 Installation & Setup Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js installed
- MongoDB installed locally (or a MongoDB Atlas URI)

### 1. Setup the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd event-management/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend should now be running on `http://localhost:5000`.*

### 2. Setup the Frontend
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd event-management/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running (usually on `http://localhost:5173`).*

### 3. Usage
- Register a new account on the frontend.
- To access the **Admin Dashboard**, you may need to manually update your user document in the MongoDB database to set `isAdmin: true` (or use a seeder script if provided).
