# Quick Start Guide - Hostel Booking System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 minutes)
```bash
cd backend
npm install
```

### Step 2: Set Up MySQL Database (1 minute)

1. Open **MySQL Command Line** or **MySQL Workbench**
2. Copy-paste the entire content from `backend/database_setup.sql`
3. Run it (Execute/Enter)
4. Done! Database is ready

### Step 3: Start the Backend Server (1 minute)
```bash
npm start
```
You should see: `Server is running on http://localhost:5000`

### Step 4: Open the Frontend (1 minute)
```bash
# Open the file in your browser:
# frontend/index.html

# OR use a Python server:
cd frontend
python -m http.server 8000
# Then visit: http://localhost:8000
```

---

## ✅ Test the Application

### Test Adding a Student:
1. Go to "Add Student" section
2. Enter any name, e.g., "John Doe"
3. Click "Add Student"
4. Message should say "Student added successfully"

### Test Booking a Room:
1. Go to "Book Room" section
2. Select the student you just created
3. Select a room (e.g., "Room 1 - Boys Hostel A")
4. Select a bed (e.g., "Bed 1 - Room 1")
5. Pick today's date for check-in
6. Pick a future date for check-out (e.g., tomorrow)
7. Click "Book Room"
8. Message should say "Booking created successfully"

### View Your Data:
1. Go to "Students" section → Click "Refresh Students" → See all students
2. Go to available beds section → Click "Refresh Available Beds" → See available beds (note: booked bed won't show here)
3. Go to "Bookings" section → Click "Refresh Bookings" → See all bookings

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to add student" | Backend server not running. Run `npm start` in backend folder |
| "Bed is not available" | Bed is already booked. Select a different bed from the list |
| Frontend shows error | Check browser console (F12) → Console tab → Look for error messages |
| MySQL error | Make sure MySQL server is running and database is created |

---

## 📁 File Structure

```
hostelmgmt/
├── backend/
│   ├── server.js              ← Main backend logic
│   ├── db.js                  ← Database connection
│   ├── package.json           ← Dependencies
│   └── database_setup.sql     ← SQL to setup database
│
└── frontend/
    ├── index.html             ← Web page
    ├── style.css              ← Styling
    └── script.js              ← Interactivity
```

---

## 🎯 What You Can Do

- ✅ Add students
- ✅ View all students
- ✅ Book rooms (beds automatically become "Booked")
- ✅ View available beds only
- ✅ View all bookings with dates
- ✅ Automatic date validation

---

## 📝 API Quick Reference

**Backend runs on:** `http://localhost:5000`

```
GET  /students            → List all students
POST /add-student         → Add new student
GET  /available-beds      → List available beds only
GET  /bookings            → List all bookings
POST /book                → Create new booking
GET  /rooms               → List all rooms
```

---

## 💡 Learning Points

Each code file has comments explaining:
- What each function does
- How the database works
- How frontend connects to backend
- How booking logic works

Great for learning full-stack development!

---

**Happy Coding!** 🎉
