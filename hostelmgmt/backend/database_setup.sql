-- ==========================================
-- HOSTEL BOOKING SYSTEM DATABASE SETUP
-- ==========================================
-- Run this SQL script in your MySQL client to create the database and tables

-- Create the database
CREATE DATABASE IF NOT EXISTS hosteldb;
USE hosteldb;

-- ==========================================
-- CREATE TABLES
-- ==========================================

-- HOSTEL Table
CREATE TABLE IF NOT EXISTS HOSTEL (
HostelID INT AUTO_INCREMENT PRIMARY KEY,
HostelName VARCHAR(100) NOT NULL
);

-- STUDENT Table
CREATE TABLE IF NOT EXISTS STUDENT (
StudentID INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(100) NOT NULL
);

-- ROOM Table
CREATE TABLE IF NOT EXISTS ROOM (
RoomID INT AUTO_INCREMENT PRIMARY KEY,
HostelID INT NOT NULL,
FOREIGN KEY (HostelID) REFERENCES HOSTEL(HostelID) ON DELETE CASCADE
);

-- BED Table
CREATE TABLE IF NOT EXISTS BED (
BedID INT AUTO_INCREMENT PRIMARY KEY,
RoomID INT NOT NULL,
Status ENUM('Available', 'Booked', 'Maintenance') DEFAULT 'Available',
FOREIGN KEY (RoomID) REFERENCES ROOM(RoomID) ON DELETE CASCADE
);

-- BOOKING Table
CREATE TABLE IF NOT EXISTS BOOKING (
Booking_ID INT AUTO_INCREMENT PRIMARY KEY,
Student_ID INT NOT NULL,
Room_ID INT NOT NULL,
Bed_No INT NOT NULL,
Booking_Date DATE NOT NULL,
Checkin_Date DATE NOT NULL,
CheckOut_Date DATE NOT NULL,
Status ENUM('Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled') DEFAULT 'Confirmed',
FOREIGN KEY (Student_ID) REFERENCES STUDENT(StudentID) ON DELETE CASCADE,
FOREIGN KEY (Room_ID) REFERENCES ROOM(RoomID) ON DELETE CASCADE,
FOREIGN KEY (Bed_No) REFERENCES BED(BedID) ON DELETE CASCADE
);

-- PAYMENT Table
CREATE TABLE IF NOT EXISTS PAYMENT (
PaymentID INT AUTO_INCREMENT PRIMARY KEY,
Booking_ID INT NOT NULL,
Amount DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (Booking_ID) REFERENCES BOOKING(Booking_ID) ON DELETE CASCADE
);

-- ==========================================
-- INSERT SAMPLE DATA
-- ==========================================

-- Insert Hostels
INSERT INTO HOSTEL (HostelName) VALUES 
('Boys Hostel A'),
('Girls Hostel B'),
('Boys Hostel C');

-- Insert Rooms (RoomID, HostelID)
INSERT INTO ROOM (HostelID) VALUES 
(1), (1), (1),
(2), (2),
(3), (3), (3);

-- Insert Beds (BedID, RoomID, Status)
-- Each room has 4 beds
INSERT INTO BED (RoomID, Status) VALUES 
(1, 'Available'), (1, 'Available'), (1, 'Available'), (1, 'Available'),
(2, 'Available'), (2, 'Available'), (2, 'Available'), (2, 'Available'),
(3, 'Available'), (3, 'Available'), (3, 'Available'), (3, 'Available'),
(4, 'Available'), (4, 'Available'), (4, 'Available'), (4, 'Available'),
(5, 'Available'), (5, 'Available'), (5, 'Available'), (5, 'Available'),
(6, 'Available'), (6, 'Available'), (6, 'Available'), (6, 'Available'),
(7, 'Available'), (7, 'Available'), (7, 'Available'), (7, 'Available'),
(8, 'Available'), (8, 'Available'), (8, 'Available'), (8, 'Available');

-- Insert Sample Students
INSERT INTO STUDENT (Name) VALUES 
('Rajesh Kumar'),
('Priya Singh'),
('Amit Patel'),
('Neha Verma'),
('Vikram Sharma');

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
-- Run these to verify your setup:

-- Select all hostels
-- SELECT * FROM HOSTEL;

-- Select all rooms with hostel names
-- SELECT r.RoomID, h.HostelName FROM ROOM r JOIN HOSTEL h ON r.HostelID = h.HostelID;

-- Select available beds
-- SELECT b.BedID, b.RoomID, b.Status FROM BED b WHERE b.Status = 'Available';

-- Select all students
-- SELECT * FROM STUDENT;
