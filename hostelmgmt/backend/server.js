// ==========================================
// HOSTEL BOOKING SYSTEM - BACKEND SERVER
// ==========================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// TEST ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.json({ message: 'Hostel Booking System Backend is running!' });
});

// ==========================================
// STUDENT ENDPOINTS
// ==========================================

/**
 * POST /add-student
 * Add a new student to the database
 * Body: { name }
 */
app.post('/add-student', async (req, res) => {
  console.log('📥 POST /add-student received');
  console.log('Request body:', req.body);
  
  try {
    const { name } = req.body;
    console.log('Student name:', name);

    // Validate input
    if (!name || name.trim() === '') {
      console.log('❌ Name is empty');
      return res.status(400).json({ error: 'Student name is required' });
    }

    // Insert student into database
    const query = 'INSERT INTO STUDENT (Name) VALUES (?)';
    console.log('🔄 Executing query:', query, 'with name:', name);
    
    const [result] = await pool.query(query, [name]);
    
    console.log('✅ Student added successfully! ID:', result.insertId);

    res.status(201).json({
      message: 'Student added successfully',
      studentId: result.insertId,
      name: name
    });
  } catch (error) {
    console.error('❌ Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

/**
 * GET /students
 * Fetch all students from the database
 */
app.get('/students', async (req, res) => {
  try {
    const query = 'SELECT StudentID, Name FROM STUDENT';
    const [students] = await pool.query(query);

    res.status(200).json({
      message: 'Students fetched successfully',
      students: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

/**
 * DELETE /students/:id
 * Delete a student by ID
 */
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /students/${id} received`);

    // Validate input
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    // Check if student exists
    const [studentCheck] = await pool.query('SELECT * FROM STUDENT WHERE StudentID = ?', [id]);
    if (studentCheck.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete student
    const query = 'DELETE FROM STUDENT WHERE StudentID = ?';
    const [result] = await pool.query(query, [id]);

    console.log(`✅ Student ${id} deleted successfully`);
    res.status(200).json({
      message: 'Student deleted successfully',
      studentId: id
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ==========================================
// HOSTEL AND ROOM ENDPOINTS
// ==========================================

/**
 * GET /hostels
 * Fetch all hostels
 */
app.get('/hostels', async (req, res) => {
  try {
    const query = 'SELECT HostelID, HostelName FROM HOSTEL';
    const [hostels] = await pool.query(query);

    res.status(200).json({
      message: 'Hostels fetched successfully',
      hostels: hostels
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ error: 'Failed to fetch hostels' });
  }
});

/**
 * GET /rooms
 * Fetch all available rooms with hostel details
 */
app.get('/rooms', async (req, res) => {
  try {
    const query = `
      SELECT r.RoomID, r.HostelID, h.HostelName 
      FROM ROOM r 
      JOIN HOSTEL h ON r.HostelID = h.HostelID
    `;
    const [rooms] = await pool.query(query);

    res.status(200).json({
      message: 'Rooms fetched successfully',
      rooms: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// ==========================================
// BED ENDPOINTS
// ==========================================

/**
 * GET /beds
 * Fetch beds in a specific room with their status
 * Query param: roomId (optional)
 */
app.get('/beds', async (req, res) => {
  try {
    const { roomId } = req.query;

    let query = 'SELECT BedID, RoomID, Status FROM BED';
    let params = [];

    // If roomId is provided, filter by room
    if (roomId) {
      query += ' WHERE RoomID = ?';
      params.push(roomId);
    }

    const [beds] = await pool.query(query, params);

    res.status(200).json({
      message: 'Beds fetched successfully',
      beds: beds
    });
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
});

/**
 * GET /available-beds
 * Fetch only available beds (Status = 'Available')
 */
app.get('/available-beds', async (req, res) => {
  try {
    const query = `
      SELECT b.BedID, b.RoomID, b.Status, r.HostelID, h.HostelName
      FROM BED b
      JOIN ROOM r ON b.RoomID = r.RoomID
      JOIN HOSTEL h ON r.HostelID = h.HostelID
      WHERE b.Status = 'Available'
    `;
    const [beds] = await pool.query(query);

    res.status(200).json({
      message: 'Available beds fetched successfully',
      beds: beds
    });
  } catch (error) {
    console.error('Error fetching available beds:', error);
    res.status(500).json({ error: 'Failed to fetch available beds' });
  }
});

// ==========================================
// BOOKING ENDPOINTS
// ==========================================

/**
 * POST /book
 * Create a new booking for a student
 * Body: { studentId, roomId, bedId, checkinDate, checkoutDate }
 * 
 * Booking Logic:
 * 1. Check if bed status is 'Available'
 * 2. If available, create booking and update bed status to 'Booked'
 * 3. Return success or error
 */
app.post('/book', async (req, res) => {
  try {
    const { studentId, roomId, bedId, checkinDate, checkoutDate } = req.body;

    // Validate input
    if (!studentId || !roomId || !bedId || !checkinDate || !checkoutDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    if (checkout <= checkin) {
      return res.status(400).json({ error: 'Checkout date must be after checkin date' });
    }

    // Check if student exists
    const [studentCheck] = await pool.query('SELECT * FROM STUDENT WHERE StudentID = ?', [studentId]);
    if (studentCheck.length === 0) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Check if bed exists and is available
    const [bedCheck] = await pool.query(
      'SELECT Status FROM BED WHERE BedID = ? AND RoomID = ?',
      [bedId, roomId]
    );

    if (bedCheck.length === 0) {
      return res.status(400).json({ error: 'Bed not found in the specified room' });
    }

    if (bedCheck[0].Status !== 'Available') {
      return res.status(400).json({ error: 'Bed is not available for booking' });
    }

    // Create booking
    const bookingDate = new Date().toISOString().split('T')[0]; // Current date
    const bookingQuery = `
      INSERT INTO BOOKING 
      (Student_ID, Room_ID, Bed_No, Booking_Date, Checkin_Date, CheckOut_Date, Status)
      VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `;
    const [bookingResult] = await pool.query(bookingQuery, [
      studentId,
      roomId,
      bedId,
      bookingDate,
      checkinDate,
      checkoutDate
    ]);

    // Update bed status to 'Booked'
    const updateBedQuery = 'UPDATE BED SET Status = ? WHERE BedID = ?';
    await pool.query(updateBedQuery, ['Booked', bedId]);

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: bookingResult.insertId,
      status: 'Confirmed'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * GET /bookings
 * Fetch all bookings with student and room details
 */
app.get('/bookings', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.Booking_ID,
        b.Student_ID,
        s.Name as StudentName,
        b.Room_ID,
        b.Bed_No,
        b.Booking_Date,
        b.Checkin_Date,
        b.CheckOut_Date,
        b.Status
      FROM BOOKING b
      JOIN STUDENT s ON b.Student_ID = s.StudentID
      ORDER BY b.Booking_Date DESC
    `;
    const [bookings] = await pool.query(query);

    res.status(200).json({
      message: 'Bookings fetched successfully',
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * GET /bookings/:bookingId
 * Fetch a specific booking by ID
 */
app.get('/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT 
        b.Booking_ID,
        b.Student_ID,
        s.Name as StudentName,
        b.Room_ID,
        b.Bed_No,
        b.Booking_Date,
        b.Checkin_Date,
        b.CheckOut_Date,
        b.Status
      FROM BOOKING b
      JOIN STUDENT s ON b.Student_ID = s.StudentID
      WHERE b.Booking_ID = ?
    `;
    const [booking] = await pool.query(query, [bookingId]);

    if (booking.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking fetched successfully',
      booking: booking[0]
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * DELETE /bookings/:id
 * Cancel/delete a booking by ID and free up the bed
 */
app.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /bookings/${id} received`);

    // Validate input
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    // Check if booking exists and get bed ID
    const [bookingCheck] = await pool.query('SELECT Bed_No FROM BOOKING WHERE Booking_ID = ?', [id]);
    if (bookingCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bedId = bookingCheck[0].Bed_No;

    // Delete booking
    const query = 'DELETE FROM BOOKING WHERE Booking_ID = ?';
    await pool.query(query, [id]);

    // Free up the bed (set status back to Available)
    const updateBedQuery = 'UPDATE BED SET Status = ? WHERE BedID = ?';
    await pool.query(updateBedQuery, ['Available', bedId]);

    console.log(`✅ Booking ${id} deleted successfully. Bed ${bedId} is now available.`);
    res.status(200).json({
      message: 'Booking deleted successfully',
      bookingId: id,
      freedBedId: bedId
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ==========================================
// PAYMENT ENDPOINTS
// ==========================================

/**
 * POST /add-payment
 * Add payment for a booking
 * Body: { bookingId, amount }
 */
app.post('/add-payment', async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Validate input
    if (!bookingId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Booking ID and valid amount are required' });
    }

    // Check if booking exists
    const [bookingCheck] = await pool.query('SELECT * FROM BOOKING WHERE Booking_ID = ?', [bookingId]);
    if (bookingCheck.length === 0) {
      return res.status(400).json({ error: 'Booking not found' });
    }

    // Insert payment
    const query = 'INSERT INTO PAYMENT (Booking_ID, Amount) VALUES (?, ?)';
    const [result] = await pool.query(query, [bookingId, amount]);

    res.status(201).json({
      message: 'Payment added successfully',
      paymentId: result.insertId,
      bookingId: bookingId,
      amount: amount
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ error: 'Failed to add payment' });
  }
});

/**
 * GET /payments
 * Fetch all payments
 */
app.get('/payments', async (req, res) => {
  try {
    const query = 'SELECT PaymentID, Booking_ID, Amount FROM PAYMENT';
    const [payments] = await pool.query(query);

    res.status(200).json({
      message: 'Payments fetched successfully',
      payments: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// ==========================================
// ERROR HANDLING
// ==========================================

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Make sure your MySQL database "hostel_db" is set up with all required tables.');
});
