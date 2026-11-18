-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Nov 18, 2026 at 09:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barangay_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `announcement_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `date_posted` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`announcement_id`, `title`, `description`, `image`, `date_posted`) VALUES
(1, 'Welcome to Barangay 415 Zone 12', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'BarangayIcon.jpg', '2026-03-12 16:00:00'),
(2, 'Breaking News', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'wp1814553.jpg', '2026-03-12 16:00:00'),
(3, 'Happy New Year', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'wp1814553_1.jpg', '2026-03-12 16:00:00'),
(4, 'Happy Fiesta', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'BarangayIcon_1.jpg', '2026-07-07 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `brgy_info`
--

CREATE TABLE `brgy_info` (
  `info_id` int(11) NOT NULL,
  `brgy_name` varchar(255) NOT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `brgy_logo` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `color_scheme` varchar(50) DEFAULT NULL,
  `date_altered` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brgy_info`
--

INSERT INTO `brgy_info` (`info_id`, `brgy_name`, `mission`, `vision`, `brgy_logo`, `about`, `color_scheme`, `date_altered`) VALUES
(1, 'Barangay 415, Zone 42', 'To provide efficient and accountable public service that                   empowers residents and promotes community development through                   inclusive governance and collaborative partnerships.', 'A progressive and sustainable Barangay 415 where residents enjoy                   improved quality of life, equal opportunities, and a strong                   sense of unity in a safe and clean environment.', 'BarangayIcon.png', 'Barangay 415 is dedicated to providing efficient public service, maintaining peace and order, and building a prosperous community for all residents in Sampaloc, Manila. Established with a rich heritage of community collaboration, we strive to leverage digital tools to enhance administrative transparency, security, and public welfare.', '#10b981', '2026-10-15 05:51:44');

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `file_id` int(11) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `date_upload` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`file_id`, `file_name`, `file_type`, `date_upload`) VALUES
(2, 'BarangayIcon.pdf', 'pdf', '2026-03-11 09:19:09');

-- --------------------------------------------------------

--
-- Table structure for table `footer`
--

CREATE TABLE `footer` (
  `footer_id` int(11) NOT NULL,
  `info_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `tp_number` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `x_link` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `household`
--

CREATE TABLE `household` (
  `household_id` int(11) NOT NULL,
  `house_number` varchar(20) DEFAULT NULL,
  `street_number` varchar(50) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `household_members` int(11) DEFAULT NULL,
  `head_family` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `household`
--

INSERT INTO `household` (`household_id`, `house_number`, `street_number`, `barangay`, `household_members`, `head_family`) VALUES
(1, '67', '890', 'Barangay 415 Zone 42', 5, 'John Doe'),
(2, '68', '890', 'Barangay 415 Zone 42', 4, 'Jane Doe'),
(3, '69', '890', 'Barangay 415 Zone 42', 3, 'Joy Doe'),
(4, '70', '890', 'Barangay 415 Zone 42', 5, 'Josie Doe'),
(5, '71', '891', 'Barangay 415 Zone 42', 2, 'James Doe'),
(6, '72', '891', 'Barangay 415 Zone 42', 4, 'Julia Doe'),
(7, '73', '892', 'Barangay 415 Zone 42', 3, 'Jackson Doe'),
(8, '74', '892', 'Barangay 415 Zone 42', 6, 'Jessica Doe'),
(9, '75', '893', 'Barangay 415 Zone 42', 2, 'Jonathan Doe'),
(10, '76', '893', 'Barangay 415 Zone 42', 4, 'Jasmine Doe');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `message_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `message_type` varchar(50) DEFAULT NULL,
  `message_urgency` varchar(20) DEFAULT NULL,
  `date_posted` datetime DEFAULT current_timestamp(),
  `status` enum('pending','solved','','') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`message_id`, `user_id`, `message`, `attachment`, `message_type`, `message_urgency`, `date_posted`, `status`) VALUES
(1, 1, 'Danger!! A house is on fire', NULL, 'complaint', 'High', '2026-04-16 22:44:02', 'solved'),
(2, 1, 'Help me!! there\'s a thief in the church', NULL, 'complaint', 'High', '2026-04-16 23:14:25', 'solved'),
(3, 1, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-04-22 00:09:32', 'solved'),
(6, 1, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-22 18:18:48', 'solved'),
(7, 1, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-04-22 18:34:43', 'solved'),
(8, 1, 'Help me!! there\'s a thief in the church', NULL, 'complaint', 'High', '2026-04-22 18:46:07', 'solved'),
(9, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 18:46:52', 'solved'),
(10, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 18:49:31', 'solved'),
(11, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 18:54:38', 'solved'),
(12, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 18:55:52', 'solved'),
(13, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 19:03:57', 'solved'),
(14, 1, 'Help me!! there\'s a thief in the church', NULL, 'concerns', 'High', '2026-04-22 19:23:07', 'solved'),
(15, 2, 'may utang ang kapitbahay ko po', NULL, 'concerns', 'Medium', '2026-04-24 00:03:34', 'solved'),
(17, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:05:19', 'solved'),
(18, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:07:19', 'solved'),
(19, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:14:58', 'solved'),
(20, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:16:31', 'solved'),
(21, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:22:38', 'solved'),
(24, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:54:01', 'solved'),
(25, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-25 22:54:52', 'solved'),
(26, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-28 23:33:06', 'solved'),
(28, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-04-28 23:39:38', 'solved'),
(29, 2, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-28 23:41:14', 'solved'),
(30, 3, 'May nahuli po akong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-04-28 23:41:55', 'solved'),
(47, 2, 'May nahuli po akong gwapong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-06-14 20:25:35', 'solved'),
(48, 2, 'May nahuli po akong gwapong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-06-14 20:26:03', 'solved'),
(50, 2, 'may utang ang kapitbahay ko po', NULL, 'complaint', 'Medium', '2026-06-23 23:36:28', 'solved'),
(52, 1, 'May nahuli po akong gwapong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-06-30 00:09:40', 'solved'),
(54, 1, 'May nahuli po akong gwapong magnanakaw sa kanto patawag po ng pulis', NULL, 'concerns', 'High', '2026-06-30 00:12:52', 'solved'),
(70, 5, 'May nahuli po akong gwapong magnanakaw sa kanto patawag po ng pulis', NULL, 'complaint', 'High', '2026-07-11 23:34:51', 'solved'),
(98, 6, 'Saklolo may namatay po sa simbahan', NULL, 'concerns', 'Low', '2026-07-20 10:42:47', 'pending'),
(99, 6, 'Saklolo may namatay po sa simbahan', NULL, 'concerns', 'High', '2026-07-20 11:02:12', 'pending'),
(100, 6, 'may namatay po na lasingero sa may kalsada', NULL, 'concerns', 'High', '2026-07-20 11:05:07', 'pending'),
(101, 6, 'may utang po si Joseph na hindi pa binabayaran', NULL, 'complaint', 'Low', '2026-07-20 11:14:34', 'pending'),
(102, 2, 'may utang po si Joseph na hindi pa binabayaran', NULL, 'complaint', 'Low', '2026-07-29 14:00:12', 'pending'),
(105, 1, 'Tulong masakit tiyan ko po \n', NULL, 'concerns', 'Low', '2026-09-07 11:04:11', 'pending'),
(106, 1, 'Tulong masakit tiyan ko po \n', NULL, 'concerns', 'Low', '2026-09-07 11:04:19', 'solved'),
(107, 1, 'may namatay po na lasingero sa may kalsada', NULL, 'concerns', 'High', '2026-10-23 16:49:41', 'pending'),
(108, 6, 'may namatay po na lasingero sa may kalsada', NULL, 'concerns', 'High', '2026-10-23 16:50:52', 'pending'),
(109, 7, 'may namatay po na lasingero sa may kalsada', NULL, 'concerns', 'High', '2026-10-23 17:15:03', 'pending'),
(110, 7, 'may namatay po na lasingero sa may kalsada', NULL, 'complaint', 'High', '2026-10-23 20:20:34', 'pending'),
(111, 1, 'Madami pong basura sa kalsada po\n', NULL, 'complaint', 'Low', '2026-11-05 23:08:14', 'solved'),
(112, 1, 'Si Destro may utang na hindi pa binabayaran sakin', NULL, 'complaint', 'Low', '2026-11-06 00:39:02', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `official`
--

CREATE TABLE `official` (
  `official_id` int(11) NOT NULL,
  `official_account_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `official`
--

INSERT INTO `official` (`official_id`, `official_account_id`, `first_name`, `middle_name`, `last_name`, `position`, `dob`, `address`, `image`, `phone_number`, `email`, `date_created`) VALUES
(1, 2, 'Emmanuel', 'M', 'Leonor', 'Barangay Captain', '1969-02-05', 'Somewhere, Manila, Philippines', 'CHAIRMAN_EMMANUEL_M__LEONOR_1.jpg', '0000000000', 'johnDoe@gmail.com', '2026-02-24 18:30:00'),
(2, 1, 'Joanna Marie', 'J', 'Sangco', 'Secretary', '2026-05-17', 'Somewhere, Manila, Philippines', 'SEC__JOANNA_MARIE_J__SANGCO_1.jpg', '0000000000', 'johnDoe@gmail.com', '2026-02-24 18:30:00'),
(3, 3, 'Erwin', 'S', 'Pata', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '1__KAG__ERWIN_S__PATA_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(4, 13, 'Niño Ferdinand', 'L', 'Zamora', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '2__KAG__NI__O_FERDINAND_L__ZAMORA_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(5, 9, 'Ceasar', 'Jay', 'Bautista', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '3__KAG__CEASAR_J__BAUTISTA_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(6, 10, 'Antonio', 'C', 'Estrada', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '4__KAG__ANTONIO_C__ESTRADA_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(7, 11, 'Joseph', 'M', 'Ferer', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '5__JOSEPH_M__FERRER_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(8, 12, 'Bernard John', 'R', 'Leonor', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '6__KAG__BERNARD_JOHN_R__LEONOR_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(9, 8, 'Leah', 'A', 'Tiu', 'Kagawad', '2026-05-17', 'Somewhere,Manila,Philippines', '7__KAG__LEAH_A_TIU_1.jpg', '00000000000', 'jakeDoe@gmail.com', '2026-02-24 18:30:00'),
(10, 14, 'Roger', 'P', 'Villanueva', 'Treasurer', '2026-05-17', 'Somewhere, Manila, Philippines', 'TREAS__ROGER_P__VILLANUEVA.jpg', '0000000000', 'johnDoe@gmail.com', '2026-02-24 18:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `official_account`
--

CREATE TABLE `official_account` (
  `official_account_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_type` enum('Admin','Staff') NOT NULL,
  `can_add` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `password_changed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `official_account`
--

INSERT INTO `official_account` (`official_account_id`, `username`, `password`, `account_type`, `can_add`, `can_edit`, `can_delete`, `password_changed`) VALUES
(1, 'B415Z42001', '$2b$10$mgG15VdIOS0t56RxsFR.8eLd1ihcDgN5Jbb0srkUE6ybuJCCvFI7C', 'Admin', 1, 1, 1, 0),
(2, 'B415Z42002', '$2b$10$pBw2plFwHEb8kVy341e5GeCHjUTFYysTX44ZCBkbrWEWyRIg5DEEK', 'Admin', 1, 1, 1, 1),
(3, 'B415Z42003', '$2b$10$hu4vPw5ai8jmnkMytjb4XukyproyyDSAaq9X94nXrEeSHqrNufn4a', 'Staff', 1, 1, 0, 0),
(8, 'B415Z42004', '$2b$10$pVJrKQjQvlgbRtpKSTZcEO.6knsSm7bA8St6iQ9Fygy3pkyapbHCC', 'Staff', 0, 0, 0, 0),
(9, 'B415Z42005', '$2b$10$6.WWL5ZoDB7NyVUocPhCIu8MZaMfT7lrCVpwQWdhwuh8YjLVFVrna', 'Staff', 1, 1, 0, 0),
(10, 'B415Z42006', '$2b$10$BWARjmv33w1mlLWmNuf1d.T3EgZpTJKq5FAi8AcPVfIaieggItY06', 'Staff', 1, 0, 1, 0),
(11, 'B415Z42007', '$2b$10$MWpiFye7hxR7S5MsLZPkK.onSz1IsYQj4vWVELllXYF.JYaIxzDxS', 'Staff', 0, 1, 1, 0),
(12, 'B415Z42008', '$2b$10$HUjn3vDEmp5I7uyAH8UudeRkZFp/M/8cdUyF6faojl5d5uBy7rrxy', 'Staff', 1, 1, 1, 0),
(13, 'B415Z42009', '$2b$10$zURRuoVnwGHk6sDqatrFDu9YfnUC5zI2E6m3ZNeVs8YlNurugVP/m', 'Staff', 0, 0, 0, 0),
(14, 'B415Z42010', '$2b$10$HWTelfAIw3PAZgqY5WJFmOwZR8MMQqZcMrJvEQiZjatkGyslyxRTu', 'Staff', 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `port`
--

CREATE TABLE `port` (
  `port_id` int(11) NOT NULL,
  `port_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `port`
--

INSERT INTO `port` (`port_id`, `port_number`) VALUES
(1, '192.168.1.16');

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `official_id` int(11) NOT NULL,
  `message_id` int(11) DEFAULT NULL,
  `report` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`report_id`, `official_id`, `message_id`, `report`, `attachment`, `date_created`) VALUES
(1, 2, 105, 'Pinainom na po ng loperamide', NULL, '2026-09-08 15:01:43'),
(2, 2, 112, 'Binayaran na ni Destro yung utang nya', NULL, '2026-11-05 16:40:13');

-- --------------------------------------------------------

--
-- Table structure for table `resident`
--

CREATE TABLE `resident` (
  `resident_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `household_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident`
--

INSERT INTO `resident` (`resident_id`, `user_id`, `household_id`, `first_name`, `middle_name`, `last_name`, `gender`, `dob`, `address`, `phone_number`, `email`, `image`) VALUES
(1, 1, 1, 'John', 'The', 'Doe', 'Male', '1990-12-03', 'Somewhere, Manila, Philippines', '0000000000', 'johnDoe@gmail.com', NULL),
(2, 2, 1, 'Jane', 'The', 'Doe', 'Female', '2026-03-24', 'Somewhere, Manila, Philippines', '0000000000', 'janeDoe@gmail.com', NULL),
(3, 4, 1, 'Joshua', 'The', 'Doe', 'Male', '1999-05-31', 'Somewhere, Manila. Philippines', '000000000', 'joshuaDoe@gmail.com', NULL),
(4, 5, 1, 'Josie', 'The', 'Doe', 'Female', '2026-07-21', 'Somewhere, Manila. Philippines', '0000000000', 'josieDoe@gmail.com', NULL),
(5, NULL, NULL, 'James', 'The', 'Doe', 'Male', '1988-04-12', 'Somewhere, Manila, Philippines', '0000000000', 'jamesDoe@gmail.com', NULL),
(6, NULL, NULL, 'Julia', 'The', 'Doe', 'Female', '1992-11-23', 'Somewhere, Manila, Philippines', '0000000000', 'juliaDoe@gmail.com', NULL),
(7, NULL, NULL, 'Jackson', 'The', 'Doe', 'Male', '1995-07-08', 'Somewhere, Manila, Philippines', '0000000000', 'jacksonDoe@gmail.com', NULL),
(8, NULL, NULL, 'Jessica', 'The', 'Doe', 'Female', '2001-02-14', 'Somewhere, Manila, Philippines', '0000000000', 'jessicaDoe@gmail.com', NULL),
(9, NULL, NULL, 'Jonathan', 'The', 'Doe', 'Other', '2003-09-29', 'Somewhere, Manila, Philippines', '0000000000', 'jonathanDoe@gmail.com', NULL),
(10, NULL, NULL, 'Jasmine', 'The', 'Doe', 'Female', '2006-05-17', 'Somewhere, Manila, Philippines', '0000000000', 'jasmineDoe@gmail.com', NULL),
(11, NULL, NULL, 'Joseph', 'The', 'Doe', 'Male', '2010-12-05', 'Somewhere, Manila, Philippines', '0000000000', 'josephDoe@gmail.com', NULL),
(12, NULL, NULL, 'Joy', 'The', 'Doe', 'Female', '2014-08-19', 'Somewhere, Manila, Philippines', '0000000000', 'joyDoe@gmail.com', NULL),
(13, NULL, NULL, 'Jacob', 'The', 'Doe', 'Male', '2017-03-11', 'Somewhere, Manila, Philippines', '0000000000', 'jacobDoe@gmail.com', NULL),
(14, NULL, NULL, 'Jenna', 'The', 'Doe', 'Female', '2020-10-29', 'Somewhere, Manila, Philippines', '0000000000', 'jennaDoe@gmail.com', NULL),
(15, NULL, NULL, 'Jonah', 'The', 'Doe', 'Male', '2023-01-15', 'Somewhere, Manila, Philippines', '0000000000', 'jonahDoe@gmail.com', NULL),
(16, NULL, NULL, 'Jasper', 'The', 'Doe', 'Male', '0000-00-00', 'Somewhere, Manila, Philippines', '9170001111', 'jasperDoe@gmail.com', NULL),
(17, NULL, NULL, 'Jada', 'The', 'Doe', 'Female', '0000-00-00', 'Somewhere, Manila, Philippines', '9170002222', 'jadaDoe@gmail.com', NULL),
(18, NULL, NULL, 'Julian', 'The', 'Doe', 'Male', '0000-00-00', 'Somewhere, Manila, Philippines', '9170003333', 'julianDoe@gmail.com', NULL),
(19, NULL, NULL, 'Jocelyn', 'The', 'Doe', 'Female', '0000-00-00', 'Somewhere, Manila, Philippines', '9170004444', 'jocelynDoe@gmail.com', NULL),
(20, 7, NULL, 'Jared', 'The', 'Doe', 'Male', '0000-00-00', 'Somewhere, Manila, Philippines', '1000000000', 'jaredDoe@gmail.com', NULL),
(21, NULL, NULL, 'Juliet', 'The', 'Doe', 'Female', '0000-00-00', 'Somewhere, Manila, Philippines', '9170006666', 'julietDoe@gmail.com', NULL),
(22, NULL, NULL, 'Jace', 'The', 'Doe', 'Male', '0000-00-00', 'Somewhere, Manila, Philippines', '9170007777', 'jaceDoe@gmail.com', NULL),
(23, NULL, NULL, 'Jade', 'The', 'Doe', 'Female', '0007-07-05', 'Somewhere, Manila, Philippines', '9170008888', 'jadeDoe@gmail.com', NULL),
(24, NULL, NULL, 'Joaquin', 'The', 'Doe', 'Male', '0000-00-00', 'Somewhere, Manila, Philippines', '9170009999', 'joaquinDoe@gmail.com', NULL),
(25, NULL, NULL, 'Jillian', 'The', 'Doe', 'Female', '0000-00-00', 'Somewhere, Manila, Philippines', '9170000000', 'jillianDoe@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('pending','verified') DEFAULT 'pending',
  `resident_id` int(11) DEFAULT NULL,
  `type` enum('resident','visitor','','') DEFAULT 'resident',
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `first_name`, `last_name`, `email`, `contact`, `password`, `status`, `resident_id`, `type`, `date_created`) VALUES
(1, 'John', 'Doe', 'johnDoe@gmail.com', '000000000', '$2b$10$Gy9KXTIJYe64AxaaNV2S6.uF/9tWviiJ.tm5mncUweTjHu/e7RCzq', 'verified', 1, 'resident', '2026-04-16 07:42:00'),
(2, 'Jane', 'Doe', 'janeDoe@gmail.com', '000000000', '$2b$10$JXBqIHUvrhyHlI83fgqiEeximD3PJ8gui1gvPc8m8RntLIEf4jRTS', 'verified', 2, 'resident', '2026-04-23 14:01:43'),
(3, 'Jake', 'Doe', 'jakeDoe@gmail.com', '000000000', '$2b$10$LPsgIa7lC15otyFfqBYU1uLIqqCLWWmJY2qlE2q1.Jx47qiMWVoZe', 'pending', NULL, 'visitor', '2026-04-23 15:43:01'),
(4, 'Joshua', 'Doe', 'joshuaDoe@gmail.com', '000000000', '$2b$10$azKus8Unvl1xjGqg68nF2OjOYWYFfSLmLy8SXXuVazF2gj6YjI92O', 'pending', 3, 'resident', '2026-07-04 10:20:16'),
(5, 'Josie', 'Doe', 'josieDoe@gmail.com', '000000000', '$2b$10$VItDz/kOPCR0M7zNmhQXwuI3BCWO8ky20e/VUP9f/JFcVeCYE7fLW', 'verified', 4, 'resident', '2026-07-04 10:24:02'),
(6, 'Jacob', 'Doe', 'jacobDoe@gmail.com', '000000000', '$2b$10$5cVguDho2lgIWmYJodq70.JwRYPNifI42BI4vuSFfuKJ54keUlliC', 'verified', NULL, 'resident', '2026-07-14 05:45:28'),
(7, 'Jared', 'Doe', 'jaredDoe@gmail.com', '1000000000', '$2b$10$8ZiASvtVctBJq1n6RXSLaejfhrDb3FKVjvNNvZzh847qyE0c5J11G', 'verified', 20, 'resident', '2026-10-23 09:13:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`announcement_id`);

--
-- Indexes for table `brgy_info`
--
ALTER TABLE `brgy_info`
  ADD PRIMARY KEY (`info_id`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`file_id`);

--
-- Indexes for table `footer`
--
ALTER TABLE `footer`
  ADD PRIMARY KEY (`footer_id`),
  ADD KEY `fk_footer_brgy_info` (`info_id`);

--
-- Indexes for table `household`
--
ALTER TABLE `household`
  ADD PRIMARY KEY (`household_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `official`
--
ALTER TABLE `official`
  ADD PRIMARY KEY (`official_id`),
  ADD KEY `official_account_id` (`official_account_id`);

--
-- Indexes for table `official_account`
--
ALTER TABLE `official_account`
  ADD PRIMARY KEY (`official_account_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `port`
--
ALTER TABLE `port`
  ADD PRIMARY KEY (`port_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_report_official` (`official_id`),
  ADD KEY `fk_report_message` (`message_id`);

--
-- Indexes for table `resident`
--
ALTER TABLE `resident`
  ADD PRIMARY KEY (`resident_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `household_id` (`household_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_resident` (`resident_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `brgy_info`
--
ALTER TABLE `brgy_info`
  MODIFY `info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `footer`
--
ALTER TABLE `footer`
  MODIFY `footer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `household`
--
ALTER TABLE `household`
  MODIFY `household_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `official`
--
ALTER TABLE `official`
  MODIFY `official_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `official_account`
--
ALTER TABLE `official_account`
  MODIFY `official_account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `port`
--
ALTER TABLE `port`
  MODIFY `port_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resident`
--
ALTER TABLE `resident`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `footer`
--
ALTER TABLE `footer`
  ADD CONSTRAINT `fk_footer_brgy_info` FOREIGN KEY (`info_id`) REFERENCES `brgy_info` (`info_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`);

--
-- Constraints for table `official`
--
ALTER TABLE `official`
  ADD CONSTRAINT `official_ibfk_1` FOREIGN KEY (`official_account_id`) REFERENCES `official_account` (`official_account_id`);

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_official` FOREIGN KEY (`official_id`) REFERENCES `official` (`official_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `resident`
--
ALTER TABLE `resident`
  ADD CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`),
  ADD CONSTRAINT `resident_ibfk_2` FOREIGN KEY (`household_id`) REFERENCES `household` (`household_id`);

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `fk_user_resident` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
