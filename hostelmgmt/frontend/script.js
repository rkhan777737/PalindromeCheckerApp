// ==========================================
// HOSTEL BOOKING SYSTEM - FRONTEND JAVASCRIPT
// ==========================================

// Backend API URL
const API_URL = 'http://localhost:5000';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Show a message to the user
 * @param {string} elementId - ID of the element to show message in
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showMessage(elementId, message, type) {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';

  // Auto-hide after 4 seconds
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 4000);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// ==========================================
// STUDENT FUNCTIONS
// ==========================================

/**
 * Add a new student
 */
async function addStudent() {
  const name = document.getElementById('studentName').value.trim();
  console.log('🖱️ Add Student button clicked. Name:', name);

  if (!name) {
    console.log('❌ Name is empty');
    showMessage('addStudentMessage', 'Please enter a student name', 'error');
    return;
  }

  try {
    console.log('📤 Sending POST request to:', `${API_URL}/add-student`);
    const response = await fetch(`${API_URL}/add-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name })
    });

    console.log('📊 Response status:', response.status);
    const data = await response.json();
    console.log('📥 Response data:', data);

    if (response.ok) {
      console.log('✅ Success! Student ID:', data.studentId);
      showMessage('addStudentMessage', `Student added successfully! ID: ${data.studentId}`, 'success');
      document.getElementById('studentName').value = '';
      loadStudents(); // Refresh the student list
      populateStudentDropdown(); // Update dropdown
    } else {
      console.log('❌ Error from backend:', data.error);
      showMessage('addStudentMessage', `Error: ${data.error}`, 'error');
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    showMessage('addStudentMessage', 'Failed to add student. Make sure the server is running.', 'error');
  }
}

/**
 * Load and display all students
 */
async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    const data = await response.json();

    const studentsList = document.getElementById('studentsList');

    if (data.students && data.students.length > 0) {
      let html = '';
      data.students.forEach(student => {
        html += `
          <tr>
            <td>${student.StudentID}</td>
            <td>${student.Name}</td>
            <td>
              <button onclick="deleteStudent(${student.StudentID}, '${student.Name}')" class="button button-danger">Delete</button>
            </td>
          </tr>
        `;
      });
      studentsList.innerHTML = html;
    } else {
      studentsList.innerHTML = '<tr><td colspan="3" style="text-align: center;">No students found</td></tr>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('studentsList').innerHTML = 
      '<tr><td colspan="3" style="text-align: center; color: red;">Failed to load students</td></tr>';
  }
}

/**
 * Delete a student
 */
async function deleteStudent(studentId, studentName) {
  if (!confirm(`Are you sure you want to delete student "${studentName}"? This will also delete all their bookings.`)) {
    return;
  }

  try {
    console.log(`🗑️ Deleting student ${studentId}`);
    const response = await fetch(`${API_URL}/students/${studentId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Student deleted successfully`);
      alert(`Student "${studentName}" deleted successfully!`);
      loadStudents(); // Refresh the list
      populateStudentDropdown(); // Update dropdown
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to delete student. Make sure the server is running.');
  }
}

/**
 * Populate the student dropdown in the booking section
 */
async function populateStudentDropdown() {
  try {
    const response = await fetch(`${API_URL}/students`);
    const data = await response.json();

    const dropdown = document.getElementById('bookStudentId');
    dropdown.innerHTML = '<option value="">Select a student</option>';

    if (data.students && data.students.length > 0) {
      data.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.StudentID;
        option.textContent = student.Name;
        dropdown.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==========================================
// ROOM AND BED FUNCTIONS
// ==========================================

/**
 * Populate the room dropdown
 */
async function populateRoomDropdown() {
  try {
    const response = await fetch(`${API_URL}/rooms`);
    const data = await response.json();

    const dropdown = document.getElementById('bookRoomId');
    dropdown.innerHTML = '<option value="">Select a room</option>';

    if (data.rooms && data.rooms.length > 0) {
      data.rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.RoomID;
        option.textContent = `Room ${room.RoomID} - ${room.HostelName}`;
        dropdown.appendChild(option);
      });
    }
    
    // Add listener to update beds when room changes
    dropdown.addEventListener('change', populateBedDropdown);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Load available beds for the selected room and populate the dropdown
 */
async function populateBedDropdown() {
  try {
    const roomId = document.getElementById('bookRoomId').value;
    
    // If no room selected, clear beds dropdown
    if (!roomId) {
      document.getElementById('bookBedId').innerHTML = '<option value="">Select a bed</option>';
      return;
    }

    const response = await fetch(`${API_URL}/beds?roomId=${roomId}`);
    const data = await response.json();

    const dropdown = document.getElementById('bookBedId');
    dropdown.innerHTML = '<option value="">Select a bed</option>';

    if (data.beds && data.beds.length > 0) {
      // Filter only available beds
      const availableBeds = data.beds.filter(bed => bed.Status === 'Available');
      
      if (availableBeds.length > 0) {
        availableBeds.forEach(bed => {
          const option = document.createElement('option');
          option.value = bed.BedID;
          option.textContent = `Bed ${bed.BedID} (${bed.Status})`;
          dropdown.appendChild(option);
        });
      } else {
        dropdown.innerHTML = '<option value="">No available beds in this room</option>';
      }
    } else {
      dropdown.innerHTML = '<option value="">No beds found in this room</option>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('bookBedId').innerHTML = '<option value="">Error loading beds</option>';
  }
}

/**
 * Load and display available beds
 */
async function loadAvailableBeds() {
  try {
    const response = await fetch(`${API_URL}/available-beds`);
    const data = await response.json();

    const bedsList = document.getElementById('bedsList');

    if (data.beds && data.beds.length > 0) {
      let html = '';
      data.beds.forEach(bed => {
        html += `
          <tr>
            <td>${bed.BedID}</td>
            <td>${bed.RoomID}</td>
            <td>${bed.HostelName}</td>
            <td><span class="badge badge-success">${bed.Status}</span></td>
          </tr>
        `;
      });
      bedsList.innerHTML = html;
    } else {
      bedsList.innerHTML = '<tr><td colspan="4" style="text-align: center;">No available beds</td></tr>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('bedsList').innerHTML = 
      '<tr><td colspan="4" style="text-align: center; color: red;">Failed to load beds</td></tr>';
  }
}

// ==========================================
// BOOKING FUNCTIONS
// ==========================================

/**
 * Create a new booking
 */
async function bookRoom() {
  const studentId = document.getElementById('bookStudentId').value;
  const roomId = document.getElementById('bookRoomId').value;
  const bedId = document.getElementById('bookBedId').value;
  const checkinDate = document.getElementById('checkinDate').value;
  const checkoutDate = document.getElementById('checkoutDate').value;

  // Validation
  if (!studentId || !roomId || !bedId || !checkinDate || !checkoutDate) {
    showMessage('bookingMessage', 'Please fill in all fields', 'error');
    return;
  }

  if (new Date(checkoutDate) <= new Date(checkinDate)) {
    showMessage('bookingMessage', 'Check-out date must be after check-in date', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: parseInt(studentId),
        roomId: parseInt(roomId),
        bedId: parseInt(bedId),
        checkinDate: checkinDate,
        checkoutDate: checkoutDate
      })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('bookingMessage', `Booking created successfully! Booking ID: ${data.bookingId}`, 'success');
      
      // Clear form
      document.getElementById('bookStudentId').value = '';
      document.getElementById('bookRoomId').value = '';
      document.getElementById('bookBedId').value = '';
      document.getElementById('checkinDate').value = '';
      document.getElementById('checkoutDate').value = '';

      // Refresh bookings and available beds
      loadBookings();
      loadAvailableBeds();
      populateBedDropdown();
    } else {
      showMessage('bookingMessage', `Error: ${data.error}`, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('bookingMessage', 'Failed to create booking. Make sure the server is running.', 'error');
  }
}

/**
 * Load and display all bookings
 */
async function loadBookings() {
  try {
    const response = await fetch(`${API_URL}/bookings`);
    const data = await response.json();

    const bookingsList = document.getElementById('bookingsList');

    if (data.bookings && data.bookings.length > 0) {
      let html = '';
      data.bookings.forEach(booking => {
        html += `
          <tr>
            <td>${booking.Booking_ID}</td>
            <td>${booking.StudentName}</td>
            <td>${booking.Room_ID}</td>
            <td>${booking.Bed_No}</td>
            <td>${booking.Checkin_Date}</td>
            <td>${booking.CheckOut_Date}</td>
            <td><span class="badge badge-info">${booking.Status}</span></td>
            <td>
              <button onclick="deleteBooking(${booking.Booking_ID}, ${booking.Bed_No})" class="button button-danger">Cancel</button>
            </td>
          </tr>
        `;
      });
      bookingsList.innerHTML = html;
    } else {
      bookingsList.innerHTML = '<tr><td colspan="8" style="text-align: center;">No bookings found</td></tr>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('bookingsList').innerHTML = 
      '<tr><td colspan="8" style="text-align: center; color: red;">Failed to load bookings</td></tr>';
  }
}

/**
 * Delete/Cancel a booking
 */
async function deleteBooking(bookingId, bedId) {
  if (!confirm(`Are you sure you want to cancel booking #${bookingId}? The bed will become available again.`)) {
    return;
  }

  try {
    console.log(`🗑️ Deleting booking ${bookingId}`);
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Booking deleted successfully`);
      alert(`Booking #${bookingId} cancelled successfully! Bed #${bedId} is now available.`);
      loadBookings(); // Refresh bookings list
      loadAvailableBeds(); // Refresh available beds
      populateBedDropdown(); // Update bed dropdown
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to cancel booking. Make sure the server is running.');
  }
}

// ==========================================
// INITIALIZE PAGE
// ==========================================

/**
 * Load initial data when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded. Initializing dropdowns...');
  
  // Populate dropdowns
  populateStudentDropdown();
  populateRoomDropdown();
  populateBedDropdown();

  // Load initial data
  loadStudents();
  loadAvailableBeds();
  loadBookings();

  // Set minimum date to today for check-in
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkinDate').setAttribute('min', today);
  document.getElementById('checkoutDate').setAttribute('min', today);
});

// ==========================================
// AUTO-REFRESH DATA
// ==========================================

// Refresh bookings every 30 seconds
setInterval(loadBookings, 30000);

// Refresh available beds every 30 seconds
setInterval(loadAvailableBeds, 30000);
