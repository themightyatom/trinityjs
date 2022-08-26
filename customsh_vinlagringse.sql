-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2022 at 12:01 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `customsh_vinlagringse`
--

-- --------------------------------------------------------

--
-- Table structure for table `accessories`
--

CREATE TABLE `accessories` (
  `id` int(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `list` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accessories`
--

INSERT INTO `accessories` (`id`, `title`, `list`, `type`, `priority`) VALUES
(101, 'Doors and Windows', '[\"1172\",\"1173\",\"1174\",\"1175\"]', 'replace', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `menu` tinyint(4) NOT NULL DEFAULT 1,
  `priority` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `title`, `menu`, `priority`) VALUES
(53, 'Le Bloc', 1, 1),
(54, 'Rooms', 0, 0),
(55, 'Vintage Classic', 1, 2),
(56, 'Vinelli Lazio', 1, 3),
(57, 'Qbic Classic', 1, 4),
(58, 'Vintage View', 1, 5),
(59, 'Vinelli Veneto', 1, 6),
(60, 'Bottles', 0, 7),
(61, 'Doors and Windows', 0, 8),
(62, 'Other', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `designs`
--

CREATE TABLE `designs` (
  `id` varchar(30) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `design` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`design`)),
  `date` varchar(255) NOT NULL,
  `share` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `designs`
--

INSERT INTO `designs` (`id`, `title`, `user_id`, `design`, `date`, `share`) VALUES
('G3IP34HWErb7U_cDrBs_5', 'bed', 2, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1168,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2.9,0,-2,2.9,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":1039,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.207922095669981,0,-2.000301157085488,1],\"name\":\"VINL2075WP\",\"sku\":\"VINL2075WP\",\"model_class\":\"WineRack\",\"model\":\"VINL2075.glb\",\"default_material\":28,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":1085,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.9000796917196894,0,-1.6599714111607458,1],\"name\":\"VINL2530DP\",\"sku\":\"VINL2530DP\",\"model_class\":\"WineRack\",\"model\":\"VINL2530.glb\",\"default_material\":28,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.33420005672791864,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-18 11:30', 0),
('G9Iy4szQVY38bOe1vhdWF', 'matTest', 2, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1168,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":\"25\",\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2.9,0,-2,2.9,0,2,-2,0,2,-2,0,-2|0x483333,0x483333,0x483333,0x483333\",\"added_accessories\":[{\"id\":\"1173\",\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.899999999999999,0.6,-0.09789004912995214,1],\"name\":\"window2\",\"sku\":\"window2\",\"model_class\":\"DecorWindow\",\"model\":\"window2.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"116,144,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":-1,\"y\":0,\"z\":-2.220446049250313e-16},\"constant\":2.899999999999999}},{\"id\":\"1175\",\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.000000000000001,0,-0.11178646906546552,1],\"name\":\"door2\",\"sku\":\"door2\",\"model_class\":\"DecorDoor\",\"model\":\"door2.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"88.7,211,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":1,\"y\":0,\"z\":2.220446049250313e-16},\"constant\":2.000000000000001}}],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},\"decorGroups\":[{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,2.2140225619077682,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,2.615215465426445,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,2.2140225619077682,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,2.615215465426445,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,0.8700074493885039,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,1.6820075154304504,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,2.4940075814723968,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,0.05800738334655753,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,-0.7539926826953889,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":890,\"matrix\":[-1,0,-1.2246467991473532e-16,0,0,1,0,0,1.2246467991473532e-16,0,-1,0,-1.5659927487373353,0,2.000188246369362,1],\"name\":\"VCKA0010\",\"sku\":\"VCKA0010\",\"model_class\":\"WineRack\",\"model\":\"VCKA0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-22 16:54', 0),
('nGGp5jtFOZXWmStq8AQvk', 'Classics', 2, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":26,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,1.85,0,-2,1.85,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF|none\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},\"decorGroups\":[{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.2933822572231293,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":880,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.001275360584259,0.03799999877810478,-1.7481855154037476,1],\"name\":\"VCKS0060\",\"sku\":\"VCKS0060\",\"model_class\":\"WineRackCorner\",\"model\":\"VCKS0060.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":893,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.002152516448729,0.07619866728782654,-1.7474489238825295,1],\"name\":\"VCKB0040\",\"sku\":\"VCKB0040\",\"model_class\":\"WineRackCorner\",\"model\":\"VCKB0040.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.8873822689056396,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.48138228058815,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.0753822922706604,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3306176960468292,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7366176843643188,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":881,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1426176726818085,0.03809933364391327,-1.999918594956398,1],\"name\":\"VCKS0030\",\"sku\":\"VCKS0030\",\"model_class\":\"WineRack\",\"model\":\"VCKS0030.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":880,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.5976968109607697,0.03809933364391327,-2.001275360584259,1],\"name\":\"VCKS0060\",\"sku\":\"VCKS0060\",\"model_class\":\"WineRackCorner\",\"model\":\"VCKS0060.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.2931408286094666,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.8871407508850098,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.481140673160553,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.07514059543609619,0.0761986851571903,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3308594822883606,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7368595600128174,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":887,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1428596377372742,0.07619866728782654,-2.0001214742660522,1],\"name\":\"VCKB0020\",\"sku\":\"VCKB0020\",\"model_class\":\"WineRack\",\"model\":\"VCKB0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":893,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.5972134785806558,0.07619866728782654,-2.002152454065369,1],\"name\":\"VCKB0040\",\"sku\":\"VCKB0040\",\"model_class\":\"WineRackCorner\",\"model\":\"VCKB0040.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":877,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8499838322401048,0.03819868877227153,-1.0900889337062833,1],\"name\":\"VCKS0020\",\"sku\":\"VCKS0020\",\"model_class\":\"WineRack\",\"model\":\"VCKS0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":877,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8499838322401045,0.03819868877227153,-0.2780889029713973,1],\"name\":\"VCKS0020\",\"sku\":\"VCKS0020\",\"model_class\":\"WineRack\",\"model\":\"VCKS0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":877,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8499838322401043,0.03819868877227153,0.5339111277634885,1],\"name\":\"VCKS0020\",\"sku\":\"VCKS0020\",\"model_class\":\"WineRack\",\"model\":\"VCKS0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":877,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.849983832240104,0.03819868877227153,1.3459111584983745,1],\"name\":\"VCKS0020\",\"sku\":\"VCKS0020\",\"model_class\":\"WineRack\",\"model\":\"VCKS0020.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":891,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.849814450948412,0.0761986851571903,-1.0901195148901601,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":891,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8498144509484118,0.0761986851571903,-0.2781193418897048,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":891,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8498144509484116,0.0761986851571903,0.5338808311107506,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":891,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.8498144509484113,0.0761986851571903,1.3458810041112057,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0}]}', '2022-7-25 18:57', 0),
('tUoekI-g5G6QjSjPGXNNc', 'Groover', 2, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0x050505,0x050505,0x050505,0x050505|33\",\"added_accessories\":[{\"id\":\"1173\",\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.19716942137858018,0.7451989302660751,-2,1],\"name\":\"none\",\"sku\":\"none\",\"model_class\":\"DecorWindow\",\"model\":\"window2.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"116,144,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":0,\"y\":0,\"z\":1},\"constant\":1.9999999999999991}}],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,1.3967135697603226,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,-0.6092509478330612,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,0.594327762722969,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,-1.010443851351738,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,0.9955206662416458,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,1.7979064732789993,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,-0.20805804431438446,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,0.1931348592042923,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,-1.4116367548704147,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,-0.20805804431438446,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,-1.4116367548704147,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,0.594327762722969,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,-1.010443851351738,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9336920111646687,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6710796029100383,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,-0.6092509478330612,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,0.1931348592042923,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,1.3967135697603226,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3348849146833455,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.532499107645992,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.26988669939136156,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,0.9955206662416458,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,1.7979064732789993,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.072272506428715,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1313062041273152,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":872,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4734654099473918,0,-2.0000119507312775,1],\"name\":\"BLCW342/3\",\"sku\":\"BLCW342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCW342_3.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0.3398982286453247,-1.8128296583890915,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3348849146833455,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.0000119507312775,0,-1.8128296583890915,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":\"29\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":929,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.999709501862526,0.10000000149011608,-1.1112436652183533,1],\"name\":\"CL-B40-N00-RU\",\"sku\":\"CL-B40-N00-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B40-N00-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":933,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.0000952239011323,0.10000000149011608,-0.11092566698789608,1],\"name\":\"CL-B10-N00-RU\",\"sku\":\"CL-B10-N00-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B10-N00-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":935,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.999709501862526,1.500000052453668,-1.360715165734291,1],\"name\":\"CL-B20-N55-RU\",\"sku\":\"CL-B20-N55-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B20-N55-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":935,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.999709501862526,1.500000052453668,-0.8607151731848717,1],\"name\":\"CL-B20-N55-RU\",\"sku\":\"CL-B20-N55-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B20-N55-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":935,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.999709501862526,1.500000052453668,-0.3607152178883552,1],\"name\":\"CL-B20-N55-RU\",\"sku\":\"CL-B20-N55-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B20-N55-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":935,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.999709501862526,1.500000052453668,0.14524928852915764,1],\"name\":\"CL-B20-N55-RU\",\"sku\":\"CL-B20-N55-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-B20-N55-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":921,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.03039975091815,0,-1.1096953749656675,1],\"name\":\"CL-F10-N01-RU\",\"sku\":\"CL-F10-N01-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-F10-N01-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":921,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.03039975091815,0,-0.10969535633921601,1],\"name\":\"CL-F10-N01-RU\",\"sku\":\"CL-F10-N01-RU\",\"model_class\":\"WineRack\",\"model\":\"CL-F10-N01-RU.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0}]}', '2022-7-25 18:37', 0);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `sku` varchar(20) NOT NULL,
  `members` varchar(255) NOT NULL,
  `accessory_groups` varchar(255) NOT NULL,
  `categories` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` int(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `stub` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `title`, `stub`) VALUES
(37, 'Svenska', 'se'),
(38, 'English', 'en');

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `model_class` varchar(255) NOT NULL DEFAULT 'DecorObject',
  `categories` varchar(255) NOT NULL,
  `snap` varchar(255) NOT NULL,
  `snap_type` varchar(20) NOT NULL,
  `exclude` varchar(255) NOT NULL,
  `include` varchar(255) NOT NULL,
  `accessory_groups` varchar(255) NOT NULL,
  `materials` varchar(255) NOT NULL,
  `default_material` int(11) NOT NULL,
  `default_material_key` varchar(10) NOT NULL,
  `default_accessories` varchar(255) NOT NULL,
  `variants` varchar(255) NOT NULL,
  `menu` tinyint(4) NOT NULL DEFAULT 1,
  `metadata` varchar(255) NOT NULL,
  `mirror` tinyint(4) NOT NULL DEFAULT 0,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `title`, `sku`, `model`, `model_class`, `categories`, `snap`, `snap_type`, `exclude`, `include`, `accessory_groups`, `materials`, `default_material`, `default_material_key`, `default_accessories`, `variants`, `menu`, `metadata`, `mirror`, `priority`) VALUES
(863, 'BLCR26H', 'BLCR26H', 'BLCR26H.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 0, '', '', '', 1, '', 0, 0),
(868, 'BLCR342_3', 'BLCR342/3', 'BLCR342_3.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 1),
(869, 'BLCR52ST', 'BLCR52ST', 'BLCR52ST.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 3),
(870, 'BLCR52SU', 'BLCR52SU', 'BLCR52SU.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 2),
(871, 'BLCW26H', 'BLCW26H', 'BLCW26H.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 4),
(872, 'BLCW342_3', 'BLCW342/3', 'BLCW342_3.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 5),
(873, 'BLCW52ST', 'BLCW52ST', 'BLCW52ST.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 7),
(874, 'BLCW52SU', 'BLCW52SU', 'BLCW52SU.glb', 'WineRack', '\"53\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 6),
(875, 'Base Mould Column', 'VCKS0080', 'VCKS0080.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(876, 'Base Mould Ib 16', 'VCKS0010', 'VCKS0010.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(877, 'Base Mould Ib 32', 'VCKS0020', 'VCKS0020.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(878, 'Vinelli Lazio vinställ, 2010SP', 'VINL2010SP', 'VINL2010.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(879, 'Vinelli Lazio vinställ, 2010BP', 'VINL2010BP', 'VINL2010.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 1),
(880, 'Base Mould Corner Inside', 'VCKS0060', 'VCKS0060.glb', 'WineRackCorner', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(881, 'Base Mould Bin 16', 'VCKS0030', 'VCKS0030.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(882, 'Base Mould Bin 32', 'VCKS0050', 'VCKS0050.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(883, 'Base Mold Case 24', 'VCKS0040', 'VCKS0040.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(884, 'Ib Column 32 - Individual 1X8', 'VCKA0041', 'VCKA0041.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(885, 'Ib Column 48 - Individual 1X12', 'VCKB0041', 'VCKB0041.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(886, 'Ib 16 32 - Individual 4X8', 'VCKA0020', 'VCKA0020.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(887, 'Ib 16 48 - Individual 4X12', 'VCKB0020', 'VCKB0020.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(888, 'Ib Ice 32 - Individual 5X10 1/2', 'VCKA0030', 'VCKA0030.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(889, 'Ib Ice 48 - Individual 5X15 1/2 Fl.', 'VCKB0030', 'VCKB0030.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(890, 'Ib 32 32 - Individual 8X8', 'VCKA0010', 'VCKA0010.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(891, 'Ib 32 48 - Individual 8X12', 'VCKB0010', 'VCKB0010.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(892, 'Ib Corner Inside 32 - Corner 4X8', 'VCKA0040', 'VCKA0040.glb', 'WineRackCorner', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(893, 'Ib Corner Inside 48 - Corner 4X12', 'VCKB0040', 'VCKB0040.glb', 'WineRackCorner', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(894, 'Bin 16 32', 'VCKA0060', 'VCKA0060.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(895, 'Bin 16 32 with dividers', 'VCKA0060|VCKC0060', 'VCKA0060_VCKC0060.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(896, 'Burgundy 32 - 8 Shelves', 'VCKA0070', 'VCKA0070.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(897, 'Burgundy 48 - 12 Shelves', 'VCKB0070', 'VCKB0070.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(898, 'Champagne 32 - 6 Shelves', 'VCKA0080', 'VCKA0080.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(899, 'Champagne 48 - 9 Shelves', 'VCKB0080', 'VCKB0080.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(900, 'Bin 32 32', 'VCKA0050', 'VCKA0050.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(901, 'VCKA0050_VCKC0060_VCKC0060', 'VCKA0050_VCKC0060_VCKC0060', 'VCKA0050_VCKC0060_VCKC006', 'WineRack', '', 'wall', '', '', '', '', '', 0, '', '', '', 1, '', 0, 0),
(902, 'VCKA0050_VCKC0060_VCKC0060', 'VCKA0050_VCKC0060_VCKC0060', 'VCKA0050_VCKC0060_VCKC006', 'WineRack', '', 'wall', '', '', '', '', '', 0, '', '', '', 1, '', 0, 0),
(903, 'Bin 32 48', 'VCKB0050', 'VCKB0050.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(904, 'Woodcase 32 - 3 Cases', 'VCKA0090', 'VCKA0090.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(905, 'Woodcase 48 - 5  Cases', 'VCKB0090', 'VCKB0090.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(906, 'Tasting Table 16', 'VCKC0010', 'VCKC0010.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(907, 'Tasting Table 32', 'VCKC0020', 'VCKC0020.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(908, 'Table Top 32', 'VCKC0030', 'VCKC0030.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(909, 'Angled Display 32', 'VCKC0040', 'VCKC0040.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(910, 'Glass Rack 32', 'VCKC0050', 'VCKC0050.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(911, 'Crown Mould 16', 'VCKR0010', 'VCKR0010.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(912, 'Crown Mould 24', 'VCKR0020', 'VCKR0020.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(913, 'Crown Mould 32', 'VCKR0030', 'VCKR0030.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(914, 'Crown Mould 48', 'VCKR0040', 'VCKR0040.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(915, 'Crown Mould Corner Inside', 'VCKR0050', 'VCKR0050.glb', 'WineRackCorner', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(916, 'Kit Rack Wine Rack Base Mold 48', 'VCKS0100', 'VCKS0100.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(917, 'Base 25', 'CL-F14-N21-RU', 'CL-F14-N21-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(918, 'Base 50', 'CL-F12-N51-RU', 'CL-F12-N51-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(919, 'Base 50 Deep', 'CL-F13-D51-RU', 'CL-F13-D51-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(920, 'Base 60', 'CL-F11-N61-RU', 'CL-F11-N61-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(921, 'Base 100', 'CL-F10-N01-RU', 'CL-F10-N01-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(922, 'Ladder 2 Rack 25', 'CL-B40-N20-RU', 'CL-B40-N20-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(923, 'Half Diamond 50', 'CL-B10-N50-RU', 'CL-B10-N50-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(924, 'Shelf 50', 'CL-B60-N50-RU', 'CL-B60-N50-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(925, 'Magnum 50', 'CL-B50-N50-RU', 'CL-B50-N50-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(926, 'Case Drawer 50 Deep', 'CL-B80-D50-RU', 'CL-B80-D50-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(927, 'Multi Square 60', 'CL-B32-N60-RU', 'CL-B32-N60-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(928, 'Display Rods 60 BTL', 'CL-B70-N60-RU', 'CL-B70-N60-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(929, 'Ladder 9 Rack 100', 'CL-B40-N00-RU', 'CL-B40-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(930, 'Ladder 9 Display 100', 'CL-B41-N00-RU', 'CL-B41-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(931, 'Multi Square 100 8×8', 'CL-B20-N00-RU', 'CL-B20-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(932, 'Multi Square 100 9×9', 'CL-B30-N00-RU', 'CL-B30-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(933, 'Multi Diamond 100', 'CL-B10-N00-RU', 'CL-B10-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(934, 'Multi Square 100', 'CL-B31-N00-RU', 'CL-B31-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(935, '1/4 Mini Square 4×4', 'CL-B20-N55-RU', 'CL-B20-N55-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(936, '1/4 Mini Diamond', 'CL-B10-N55-RU', 'CL-B10-N55-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(937, 'Display 25', 'CL-D10-N20-RU', 'CL-D10-N20-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(938, 'Display 50', 'CL-D10-N50-RU', 'CL-D10-N50-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(939, 'Display 60', 'CL-D10-N60-RU', 'CL-D10-N60-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(940, 'Display 100', 'CL-D10-N00-RU', 'CL-D10-N00-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(941, 'Filler', 'CL-G30-N01-RU', 'CL-G30-N01-RU.glb', 'WineRack', '\"57\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(942, '6 Flaskor Svart', 'WS12-K', 'WS12-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(943, '9 Flaskor Svart', 'WS31-K', 'WS31-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(944, '12 Flaskor Svart', 'WS41-K', 'WS41-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(945, '18 Flaskor Svart', 'WS32-K', 'WS32-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(946, '24 Flaskor Svart', 'WS42-K', 'WS42-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(947, '27 Flaskor Svart', 'WS33-K', 'WS33-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(948, '36 Flaskor Svart', 'WS43-K', 'WS43-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(949, '9 Flaskor Platinum', 'WS31-P', 'WS31-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(950, '12 Flaskor Platinum', 'WS41-P', 'WS41-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(951, '18 Flaskor Platinum', 'WS32-P', 'WS32-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(952, '24 Flaskor Platinum', 'WS42-P', 'WS42-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(953, '27 Flaskor Platinum', 'WS33-P', 'WS33-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(954, '36 Flaskor Platinum', 'WS43-P', 'WS43-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(955, '9 Flaskor Magnum Svart', 'WS-MAG1-K', 'WS-MAG1-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(956, '18 Flaskor Magnum Svart', 'WS-MAG2-K', 'WS-MAG2-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(957, '18 Flaskor Magnum Platinum', 'WS-MAG2-P', 'WS-MAG2-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(958, '9 Flaskor Presentationshylla', 'WS-PR-K', 'WS-PR-K.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(959, '9 Flaskor Presentationshylla Platinum', 'WS-PR-P', 'WS-PR-P.glb', 'WineRack', '\"58\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(960, 'Vinelli Lazio vinställ, 2010NO', 'VINL2010NO', 'VINL2010.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 2),
(961, 'Vinelli Lazio vinställ, 2010DP', 'VINL2010DP', 'VINL2010.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 7),
(962, 'Vinelli Lazio vinställ, 2010WP', 'VINL2010WP', 'VINL2010.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 4),
(963, 'Vinelli Lazio vinställ, 2014SP', 'VINL2014SP', 'VINL2014.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 5),
(964, 'Vinelli Lazio vinställ, 2030SP', 'VINL2030SP', 'VINL2030.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(965, 'Vinelli Lazio vinställ, 2014BP', 'VINL2014BP', 'VINL2014.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 6),
(967, 'Vinelli Veneto 7100, Modul', 'VINV7100M', 'VINV7100M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(968, 'Vinelli Lazio vinställ, 2014DP', 'VINL2014DP', 'VINL2014.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(969, 'Vinelli Lazio vinställ, 2014NO', 'VINL2014NO', 'VINL2014.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(970, 'Vinelli Lazio vinställ, 2014WP', 'VINL2014WP', 'VINL2014.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(971, 'Vinelli Lazio vinställ, 2030BP', 'VINL2030BP', 'VINL2030.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(972, 'Vinelli Lazio vinställ, 2030DP', 'VINL2030DP', 'VINL2030.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(973, 'Vinelli Lazio vinställ, 2030NO', 'VINL2030NO', 'VINL2030.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(974, 'Vinelli Lazio vinställ, 2030WP', 'VINL2030WP', 'VINL2030.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(975, 'Vinelli Lazio vinställ, 2031SP', 'VINL2031SP', 'VINL2031.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(976, 'Vinelli Lazio vinställ, 2031BP', 'VINL2031BP', 'VINL2031.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(977, 'Vinelli Lazio vinställ, 2031DP', 'VINL2031DP', 'VINL2031.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(978, 'Vinelli Lazio vinställ, 2031NO', 'VINL2031NO', 'VINL2031.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(979, 'Vinelli Lazio vinställ, 2031WP', 'VINL2031WP', 'VINL2031.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(980, 'Vinelli Lazio vinställ, 2032SP', 'VINL2032SP', 'VINL2032.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(981, 'Vinelli Lazio vinställ, 2032BP', 'VINL2032BP', 'VINL2032.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(982, 'Vinelli Lazio vinställ, 2032DP', 'VINL2032DP', 'VINL2032.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(983, 'Vinelli Lazio vinställ, 2032NO', 'VINL2032NO', 'VINL2032.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(984, 'Vinelli Lazio vinställ, 2032WP', 'VINL2032WP', 'VINL2032.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(985, 'Vinelli Lazio vinställ, 2033SP', 'VINL2033SP', 'VINL2033.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(986, 'Vinelli Lazio vinställ, 2033BP', 'VINL2033BP', 'VINL2033.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(987, 'Vinelli Lazio vinställ, 2033DP', 'VINL2033DP', 'VINL2033.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(988, 'Vinelli Lazio vinställ, 2033NO', 'VINL2033NO', 'VINL2033.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(989, 'Vinelli Lazio vinställ, 2033WP', 'VINL2033WP', 'VINL2033.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(990, 'Vinelli Lazio vinställ, 2034SP', 'VINL2034SP', 'VINL2034.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(991, 'Vinelli Lazio vinställ, 2034BP', 'VINL2034BP', 'VINL2034.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(992, 'Vinelli Lazio vinställ, 2034DP', 'VINL2034DP', 'VINL2034.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(993, 'Vinelli Lazio vinställ, 2034NO', 'VINL2034NO', 'VINL2034.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(994, 'Vinelli Lazio vinställ, 2034WP', 'VINL2034WP', 'VINL2034.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(995, 'Vinelli Lazio vinställ, 2035SP', 'VINL2035SP', 'VINL2035.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(996, 'Vinelli Lazio vinställ, 2035BP', 'VINL2035BP', 'VINL2035.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(997, 'Vinelli Lazio vinställ, 2035DP', 'VINL2035DP', 'VINL2035.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(998, 'Vinelli Lazio vinställ, 2035NO', 'VINL2035NO', 'VINL2035.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(999, 'Vinelli Lazio vinställ, 2035WP', 'VINL2035WP', 'VINL2035.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1000, 'Vinelli Lazio vinställ, 2036SP', 'VINL2036SP', 'VINL2036.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1001, 'Vinelli Lazio vinställ, 2036WP', 'VINL2036WP', 'VINL2036.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1002, 'Vinelli Lazio vinställ, 2060SP', 'VINL2060SP', 'VINL2060.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1003, 'Vinelli Lazio vinställ, 2060BP', 'VINL2060BP', 'VINL2060.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1004, 'Vinelli Lazio vinställ, 2060DP', 'VINL2060DP', 'VINL2060.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1005, 'Vinelli Lazio vinställ, 2060NO', 'VINL2060NO', 'VINL2060.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1006, 'Vinelli Lazio vinställ, 2060WP', 'VINL2060WP', 'VINL2060.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1007, 'Vinelli Lazio vinställ, 2061SP', 'VINL2061SP', 'VINL2061.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1008, 'Vinelli Lazio vinställ, 2061BP', 'VINL2061BP', 'VINL2061.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1009, 'Vinelli Lazio vinställ, 2061DP', 'VINL2061DP', 'VINL2061.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1010, 'Vinelli Lazio vinställ, 2061NO', 'VINL2061NO', 'VINL2061.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1011, 'Vinelli Lazio vinställ, 2061WP', 'VINL2061WP', 'VINL2061.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1012, 'Vinelli Lazio vinställ, 2062SP', 'VINL2062SP', 'VINL2062.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1013, 'Vinelli Lazio vinställ, 2062BP', 'VINL2062BP', 'VINL2062.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1015, 'Vinelli Lazio vinställ, 2062DP', 'VINL2062DP', 'VINL2062.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1016, 'Vinelli Lazio vinställ, 2062NO', 'VINL2062NO', 'VINL2062.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1017, 'Vinelli Lazio vinställ, 2062WP', 'VINL2062WP', 'VINL2062.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1018, 'Vinelli Lazio vinställ, 2066SP', 'VINL2066SP', 'VINL2066.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1019, 'Vinelli Lazio vinställ, 2066DP', 'VINL2066DP', 'VINL2066.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1021, 'Vinelli Lazio vinställ, 2066BP', 'VINL2066BP', 'VINL2066.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1022, 'Vinelli Lazio vinställ, 2066NO', 'VINL2066NO', 'VINL2066.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1023, 'Vinelli Lazio vinställ, 2066WO', 'VINL2066WO', 'VINL2066.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1024, 'Vinelli Lazio vinställ, 2067SP', 'VINL2067SP', 'VINL2067.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1025, 'Vinelli Lazio vinställ, 2067BP', 'VINL2067BP', 'VINL2067.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1026, 'Vinelli Lazio vinställ, 2067DP', 'VINL2067DP', 'VINL2067.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1027, 'Vinelli Lazio vinställ, 2067NO', 'VINL2067NO', 'VINL2067.glb', 'DecorObject', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1028, 'Vinelli Lazio vinställ, 2067WP', 'VINL2067WP', 'VINL2067.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1029, 'Vinelli Lazio vinställ, 2068SP', 'VINL2068SP', 'VINL2068.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1030, 'Vinelli Lazio vinställ, 2068BP', 'VINL2068BP', 'VINL2068.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1031, 'Vinelli Lazio vinställ, 2068DP', 'VINL2068DP', 'VINL2068.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1032, 'Vinelli Lazio vinställ, 2068NO', 'VINL2068NO', 'VINL2068.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1033, 'Vinelli Lazio vinställ, 2068WP', 'VINL2068WP', 'VINL2068.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1034, 'Vinelli Lazio vinställ, 2074SP', 'VINL2074SP', 'VINL2074.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '\"26\"', 26, 'wood', '', '', 1, '', 0, 0),
(1035, 'Vinelli Lazio vinställ, 2075SP', 'VINL2075SP', 'VINL2075.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1036, 'Vinelli Lazio vinställ, 2075BP', 'VINL2075BP', 'VINL2075.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1037, 'Vinelli Lazio vinställ, 2075DP', 'VINL2075DP', 'VINL2075.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1038, 'Vinelli Lazio vinställ, 2075NO', 'VINL2075NO', 'VINL2075.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1039, 'Vinelli Lazio vinställ, 2075WP', 'VINL2075WP', 'VINL2075.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1040, 'Vinelli Lazio vinställ, 2090SP', 'VINL2090SP', 'VINL2090.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1041, 'Vinelli Lazio vinställ, 2090BP', 'VINL2090BP', 'VINL2090.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1042, 'Vinelli Lazio vinställ, 2090DP', 'VINL2090DP', 'VINL2090.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1043, 'Vinelli Lazio vinställ, 2090NO', 'VINL2090NO', 'VINL2090.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1044, 'Vinelli Lazio vinställ, 2090WP', 'VINL2090WP', 'VINL2090.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1045, 'Vinelli Lazio vinställ, 2165SP', 'VINL2165SP', 'VINL2165.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1046, 'Vinelli Lazio vinställ, 2165BP', 'VINL2165BP', 'VINL2165.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1047, 'Vinelli Lazio vinställ, 2165NO', 'VINL2165NO', 'VINL2165.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1048, 'Vinelli Lazio vinställ, 2165WP', 'VINL2165WP', 'VINL2165.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1049, 'Vinelli Lazio vinställ, 2390SP', 'VINL2390SP', 'VINL2390.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1050, 'Vinelli Lazio vinställ, 2390BP', 'VINL2390BP', 'VINL2390.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1051, 'Vinelli Lazio vinställ, 2390DP', 'VINL2390DP', 'VINL2390.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1052, 'Vinelli Lazio vinställ, 2390NO', 'VINL2390NO', 'VINL2390.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1053, 'Vinelli Lazio vinställ, 2390WP', 'VINL2390WP', 'VINL2390.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1054, 'Vinelli Lazio vinställ, 2391SP', 'VINL2391SP', 'VINL2391.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1055, 'Vinelli Lazio vinställ, 2391BP', 'VINL2391BP', 'VINL2391.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1056, 'Vinelli Lazio vinställ, 2391DP', 'VINL2391DP', 'VINL2391.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1057, 'Vinelli Lazio vinställ, 2391NO', 'VINL2391NO', 'VINL2391.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1058, 'Vinelli Lazio vinställ, 2391WP', 'VINL2391WP', 'VINL2391.glb', 'WineRackCorner', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1059, 'Vinelli Lazio vinställ, 2510SP', 'VINL2510SP', 'VINL2510.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1060, 'Vinelli Lazio vinställ, 2510BP', 'VINL2510BP', 'VINL2510.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1061, 'Vinelli Lazio vinställ, 2510DP', 'VINL2510DP', 'VINL2510.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1062, 'Vinelli Lazio vinställ, 2510NO', 'VINL2510NO', 'VINL2510.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1063, 'Vinelli Lazio vinställ, 2510WP', 'VINL2510WP', 'VINL2510.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1064, 'Vinelli Lazio vinställ, 2511SP', 'VINL2511SP', 'VINL2511.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1065, 'Vinelli Lazio vinställ, 2511BP', 'VINL2511BP', 'VINL2511.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1066, 'Vinelli Lazio vinställ, 2511DP', 'VINL2511DP', 'VINL2511.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1067, 'Vinelli Lazio vinställ, 2511NO', 'VINL2511NO', 'VINL2511.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1068, 'Vinelli Lazio vinställ, 2511WP', 'VINL2511WP', 'VINL2511.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1069, 'Vinelli Lazio vinställ, 2515SP', 'VINL2515SP', 'VINL2515.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1070, 'Vinelli Lazio vinställ, 2515BP', 'VINL2515BP', 'VINL2515.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1071, 'Vinelli Lazio vinställ, 2515DP', 'VINL2515DP', 'VINL2515.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1072, 'Vinelli Lazio vinställ, 2515NO', 'VINL2515NO', 'VINL2515.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1073, 'Vinelli Lazio vinställ, 2515WP', 'VINL2515WP', 'VINL2515.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1074, 'Vinelli Lazio vinställ, 2516SP', 'VINL2516SP', 'VINL2516.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1075, 'Vinelli Lazio vinställ, 2516BP', 'VINL2516BP', 'VINL2516.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1076, 'Vinelli Lazio vinställ, 2516NO', 'VINL2516NO', 'VINL2516.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1077, 'Vinelli Lazio vinställ, 2516NO', 'VINL2516NO', 'VINL2516.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1078, 'Vinelli Lazio vinställ, 2521SP', 'VINL2521SP', 'VINL2521.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1079, 'Vinelli Lazio vinställ, 2521BP', 'VINL2521BP', 'VINL2521.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1080, 'Vinelli Lazio vinställ, 2521DP', 'VINL2521DP', 'VINL2521.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1081, 'Vinelli Lazio vinställ, 2521NO', 'VINL2521NO', 'VINL2521.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1082, 'Vinelli Lazio vinställ, 2521WP', 'VINL2521WP', 'VINL2521.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1083, 'Vinelli Lazio vinställ, 2530SP', 'VINL2530SP', 'VINL2530.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1084, 'Vinelli Lazio vinställ, 2530BP', 'VINL2530BP', 'VINL2530.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1085, 'Vinelli Lazio vinställ, 2530DP', 'VINL2530DP', 'VINL2530.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1086, 'Vinelli Lazio vinställ, 2530NO', 'VINL2530NO', 'VINL2530.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1087, 'Vinelli Lazio vinställ, 2530WP', 'VINL2530WP', 'VINL2530.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1088, 'Vinelli Lazio vinställ, 2531SP', 'VINL2531SP', 'VINL2531.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1089, 'Vinelli Lazio vinställ, 2531DP', 'VINL2531DP', 'VINL2531.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1090, 'Vinelli Lazio vinställ, 2531BP', 'VINL2531BP', 'VINL2531.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1091, 'Vinelli Lazio vinställ, 2531WP', 'VINL2531WP', 'VINL2531.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1092, 'Vinelli Lazio vinställ, 2532SP', 'VINL2532SP', 'VINL2532.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1093, 'Vinelli Lazio vinställ, 2532BP', 'VINL2532BP', 'VINL2532.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1094, 'Vinelli Lazio vinställ, 2532DP', 'VINL2532DP', 'VINL2532.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1095, 'Vinelli Lazio vinställ, 2532NO', 'VINL2532NO', 'VINL2532.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1096, 'Vinelli Lazio vinställ, 2532WP', 'VINL2532WP', 'VINL2532.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1097, 'Vinelli Lazio vinställ, 2540SP', 'VINL2540SP', 'VINL2540.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1098, 'Vinelli Lazio vinställ, 2540BP', 'VINL2540BP', 'VINL2540.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1099, 'Vinelli Lazio vinställ, 2540DP', 'VINL2540DP', 'VINL2540.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1100, 'Vinelli Lazio vinställ, 2540NO', 'VINL2540NO', 'VINL2540.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1101, 'Vinelli Lazio vinställ, 2540WP', 'VINL2540WP', 'VINL2540.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1102, 'Vinelli Lazio vinställ, 2541SP', 'VINL2541SP', 'VINL2541.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1103, 'Vinelli Lazio vinställ, 2541BP', 'VINL2541BP', 'VINL2541.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1104, 'Vinelli Lazio vinställ, 2541DP', 'VINL2541DP', 'VINL2541.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1105, 'Vinelli Lazio vinställ, 2541NO', 'VINL2541NO', 'VINL2541.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1106, 'Vinelli Lazio vinställ, 2541WP', 'VINL2541WP', 'VINL2541.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1107, 'Vinelli Lazio vinställ, 2542SP', 'VINL2542SP', 'VINL2542.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1108, 'Vinelli Lazio vinställ, 2542BP', 'VINL2542BP', 'VINL2542.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1109, 'Vinelli Lazio vinställ, 2542DP', 'VINL2542DP', 'VINL2542.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1110, 'Vinelli Lazio vinställ, 2542NO', 'VINL2542NO', 'VINL2542.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1111, 'Vinelli Lazio vinställ, 2542WP', 'VINL2542WP', 'VINL2542.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1112, 'Vinelli Lazio vinställ, 2545SP', 'VINL2545SP', 'VINL2545.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1113, 'Vinelli Lazio vinställ, 2545BP', 'VINL2545BP', 'VINL2545.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1114, 'Vinelli Lazio vinställ, 2545DP', 'VINL2545DP', 'VINL2545.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1115, 'Vinelli Lazio vinställ, 2545NO', 'VINL2545NO', 'VINL2545.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1116, 'Vinelli Lazio vinställ, 2545WP', 'VINL2545WP', 'VINL2545.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1117, 'Vinelli Lazio vinställ, 2546SP', 'VINL2546SP', 'VINL2546.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1118, 'Vinelli Lazio vinställ, 2546BP', 'VINL2546BP', 'VINL2546.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1119, 'Vinelli Lazio vinställ, 2546DP', 'VINL2546DP', 'VINL2546.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1120, 'Vinelli Lazio vinställ, 2558SP', 'VINL2558SP', 'VINL2558.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 26, 'wood', '', '', 1, '', 0, 0),
(1121, 'Vinelli Lazio vinställ, 2558BP', 'VINL2558BP', 'VINL2558.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 27, 'wood', '', '', 1, '', 0, 0),
(1122, 'Vinelli Lazio vinställ, 2558DP', 'VINL2558DP', 'VINL2558.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1123, 'Vinelli Lazio vinställ, 2558NO', 'VINL2558NO', 'VINL2558.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1124, 'Vinelli Lazio vinställ, 2558WP', 'VINL2558WP', 'VINL2558.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 30, 'wood', '', '', 1, '', 0, 0),
(1125, 'Vinelli Lazio vinställ, 2165DP', 'VINL2165DP', 'VINL2165.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1126, 'Vinelli Lazio vinställ, 2516DP', 'VINL2516DP', 'VINL2516.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 28, 'wood', '', '', 1, '', 0, 0),
(1127, 'Vinelli Lazio vinställ, 2531NO', 'VINL2531NO', 'VINL2531.glb', 'WineRack', '\"56\"', 'wall', '', '', '', '', '[\"26\",\"27\",\"28\",\"29\",\"30\"]', 29, 'wood', '', '', 1, '', 0, 0),
(1128, 'Vinelli Veneto 7102, Modul', 'VINV7102M', 'VINV7102M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1129, 'Vinelli Veneto 7103, Modul', 'VINV7103M', 'VINV7103M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1130, 'Vinelli Veneto 7104, Modul', 'VINV7104M', 'VINV7104M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1131, 'Vinelli Veneto 7121, Modul', 'VINV7121M', 'VINV7121M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1132, 'Vinelli Veneto 7125, Modul', 'VINV7125M', 'VINV7125M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1133, 'Vinelli Veneto 7150, Modul', 'VINV7150M', 'VINV7150M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1134, 'Vinelli Veneto 7202, Modul', 'VINV7202M', 'VINV7202M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1135, 'Vinelli Veneto 7204, Modul', 'VINV7204M', 'VINV7204M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1136, 'Vinelli Veneto 7205, Modul', 'VINV7205M', 'VINV7205M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1137, 'Vinelli Veneto 7206, Modul', 'VINV7206M', 'VINV7206M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1138, 'Vinelli Veneto 7208, Modul', 'VINV7208M', 'VINV7208M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1139, 'Vinelli Veneto 7210, Modul', 'VINV7210M', 'VINV7210M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1140, 'Vinelli Veneto 7215, Modul', 'VINV7215M', 'VINV7215M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1141, 'Vinelli Veneto 7220, Modul', 'VINV7220M', 'VINV7220M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1142, 'Vinelli Veneto 7221, Modul', 'VINV7221M', 'VINV7221M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1143, 'Vinelli Veneto 7225, Modul', 'VINV7225M', 'VINV7225M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1144, 'Vinelli Veneto 7230, Modul', 'VINV7230M', 'VINV7230M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1145, 'Vinelli Veneto 7240, Modul', 'VINV7240M', 'VINV7240M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1146, 'Vinelli Veneto 7241, Modul', 'VINV7241M', 'VINV7241M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1147, 'Vinelli Veneto 7242, Modul', 'VINV7242M', 'VINV7242M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1148, 'Vinelli Veneto 7245, Modul', 'VINV7245M', 'VINV7245M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1149, 'Vinelli Veneto 7250, Modul', 'VINV7250M', 'VINV7250M.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1150, 'Vinelli Veneto 7206, Kit', 'VINV7206K', 'VINV7206K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1151, 'Vinelli Veneto 7208, Kit', 'VINV7208K', 'VINV7208K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1152, 'Vinelli Veneto 7210, Kit', 'VINV7210K', 'VINV7210K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1153, 'Vinelli Veneto 7215, Kit', 'VINV7215K', 'VINV7215K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1154, 'Vinelli Veneto 7220, Kit', 'VINV7220K', 'VINV7220K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1155, 'Vinelli Veneto 7221, Kit', 'VINV7221K', 'VINV7221K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1156, 'Vinelli Veneto 7245, Kit', 'VINV7245K', 'VINV7245K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1157, 'Vinelli Veneto 7250, Kit', 'VINV7250K', 'VINV7250K.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1158, 'Vinelli Veneto 7001, Bas', 'VINV7001B', 'VINV7001B.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1159, 'Vinelli Veneto 7002, Bas', 'VINV7002B', 'VINV7002B.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1160, 'Vinelli Veneto 7003, Bas', 'VINV7003B', 'VINV7003B.glb', 'WineRack', '\"59\"', 'wall', '', '', '', '', '', 31, 'wood', '', '', 1, '', 0, 0),
(1161, 'Bin 32 32 with dividers', 'VCKA0050|VCKC0060|VCKC0060', 'VCKA0050_VCKC0060_VCKC0060.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1162, 'Bin 32 48 with dividers', 'VCKB0050|VCKC0060|VCKC0060|VCKC0060', 'VCKB0050_VCKC0060_VCKC0060_VCKC0060.glb', 'WineRack', '\"55\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1163, 'wine', 'wine', 'wine.glb', 'DecorObject', '\"60\"', '', '', '', '', '', '', 1, '', '', '', 0, '', 0, 0),
(1165, 'champbot', 'champbot', 'champbot.glb', 'DecorObject', '\"60\"', '', '', '', '', '', '', 1, '', '', '', 0, '', 0, 0),
(1166, 'halfbot', 'halfbot', 'halfbot.glb', 'DecorObject', '\"60\"', '', '', '', '', '', '', 1, '', '', '', 0, '', 0, 0),
(1167, 'magnum', 'magnum', 'magnum.glb', 'DecorObject', '\"60\"', '', '', '', '', '', '', 1, '', '', '', 0, '', 0, 0);
INSERT INTO `models` (`id`, `title`, `sku`, `model`, `model_class`, `categories`, `snap`, `snap_type`, `exclude`, `include`, `accessory_groups`, `materials`, `default_material`, `default_material_key`, `default_accessories`, `variants`, `menu`, `metadata`, `mirror`, `priority`) VALUES
(1168, 'dynamic_room', 'dynamic_room', 'dynamic_room.glb', 'DynamicRoom', '\"54\"', '', 'environment', '', '', '\"101\"', '[\"22\",\"23\",\"25\"]', 22, 'floo', '', '', 1, '', 0, 3),
(1169, 'Box Room', 'dynamic_room', 'dynamic_room.glb', 'DynamicRoom', '\"54\"', '', 'environment', '', '', '\"101\"', '[\"22\",\"23\",\"25\"]', 22, 'floo', '', '', 1, '250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF', 0, 3),
(1170, 'L Room ', 'dynamic_room', 'dynamic_room.glb', 'DynamicRoom', '\"54\"', '', 'environment', '', '', '\"101\"', '[\"22\",\"23\",\"25\"]', 22, 'floo', '', '', 1, '250|-2,0,-2,2,0,-2,2,0,2,0,0,2,0,0,0,-2,0,0,-2,0,-2|#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF', 0, 3),
(1171, 'T Room', 'dynamic_room', 'dynamic_room.glb', 'DynamicRoom', '\"54\"', '', 'environment', '', '', '\"101\"', '[\"22\",\"23\",\"25\"]', 22, 'floo', '', '', 1, '250|-2,0,-2,2,0,-2,2,0,0,1,0,0,1,0,2,-1,0,2,-1,0,0,-2,0,0,-2,0,-2|#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF', 0, 3),
(1172, 'window', 'none', 'window.glb', 'DecorWindow', '\"61\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1173, 'window2', 'none', 'window2.glb', 'DecorWindow', '\"61\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1174, 'door', 'none', 'door.glb', 'DecorDoor', '\"61\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1175, 'door2', 'none', 'door2.glb', 'DecorDoor', '\"61\"', 'wall', '', '', '', '', '', 1, '', '', '', 1, '', 0, 0),
(1176, 'black_frame', 'none', 'black_frame.glb', 'DecorObject', '', '', '', '', '', '', '', 1, '', '', '', 0, '', 0, 0),
(1177, 'winebox', 'none', 'winebox.glb', 'DecorObject', '\"62\"', 'winebox', 'all', '', '', '', '', 1, '', '', '', 0, '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `shares`
--

CREATE TABLE `shares` (
  `id` varchar(30) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(30) NOT NULL,
  `design` longtext NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shares`
--

INSERT INTO `shares` (`id`, `title`, `user_id`, `design`, `date`) VALUES
('5UWmWomLMzW74v-QzMxtd', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":31,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":956,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3970822317655518,1.6522049235343084,-2.000276765934846,1],\"name\":\"WS-MAG2-K\",\"sku\":\"WS-MAG2-K\",\"model_class\":\"WineRack\",\"model\":\"WS-MAG2-K.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":1147,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.9095432364089149,1.6522049235343084,-1.9999999898672098,1],\"name\":\"VINV7242M\",\"sku\":\"VINV7242M\",\"model_class\":\"WineRack\",\"model\":\"VINV7242M.glb\",\"default_material\":31,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.995520666241646,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603228,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789996,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.5943277627229693,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890913,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438424,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.609250947833061,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704145,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.0104438513517378,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":891,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.11405240031190877,1.6522049235343084,-2.00030315539139,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-19 16:43'),
('AqNKt2c9Mv450bA0wuzq_', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":31,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":956,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3970822317655518,1.6522049235343084,-2.000276765934846,1],\"name\":\"WS-MAG2-K\",\"sku\":\"WS-MAG2-K\",\"model_class\":\"WineRack\",\"model\":\"WS-MAG2-K.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":1147,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.9095432364089149,1.6522049235343084,-1.9999999898672098,1],\"name\":\"VINV7242M\",\"sku\":\"VINV7242M\",\"model_class\":\"WineRack\",\"model\":\"VINV7242M.glb\",\"default_material\":31,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.995520666241646,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603228,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789996,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.5943277627229693,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890913,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438424,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.609250947833061,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704145,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.0104438513517378,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":891,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.11405240031190877,1.6522049235343084,-2.00030315539139,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-19 16:42'),
('elkJqZworJBZ_SYeQ9F3d', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1168,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2.9,0,-2,2.9,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":1085,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.9000796917196894,0,-1.6599714111607458,1],\"name\":\"VINL2530DP\",\"sku\":\"VINL2530DP\",\"model_class\":\"WineRack\",\"model\":\"VINL2530.glb\",\"default_material\":28,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":1039,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.207922095669981,0,-2.000301157085488,1],\"name\":\"VINL2075WP\",\"sku\":\"VINL2075WP\",\"model_class\":\"WineRack\",\"model\":\"VINL2075.glb\",\"default_material\":30,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.33420005672791864,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-18 9:22'),
('FMtkbEMnkUCXgjv1B5Oxx', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0xfa0000,0xfa0000,0xfa0000,0xfa0000\",\"added_accessories\":[{\"id\":\"1175\",\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,1.9999999999999998,0,0.9024000377208854,1],\"name\":\"door2\",\"sku\":\"door2\",\"model_class\":\"DecorDoor\",\"model\":\"door2.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"88.7,211,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":-1,\"y\":0,\"z\":-2.220446049250313e-16},\"constant\":1.9999999999999982}},{\"id\":\"1172\",\"matrix\":[2.220446049250313e-16,0,-1,0,0,1,0,0,1,0,2.220446049250313e-16,0,-2.000000000000001,0.46413982714597424,0.5342501707453482,1],\"name\":\"window\",\"sku\":\"window\",\"model_class\":\"DecorWindow\",\"model\":\"window.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"116,144,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":-1,\"y\":0,\"z\":-2.220446049250313e-16},\"constant\":2}},{\"id\":\"1172\",\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3755366924647816,0.4132261521818523,-2,1],\"name\":\"window\",\"sku\":\"window\",\"model_class\":\"DecorWindow\",\"model\":\"window.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"116,144,#FFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":0,\"y\":0,\"z\":1},\"constant\":1.9999999999999991}},{\"id\":\"1172\",\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2,0.4521456096766654,-0.706861216400438,1],\"name\":\"window\",\"sku\":\"window\",\"model_class\":\"DecorWindow\",\"model\":\"window.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"116,144,#cd1d1d\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"dragplane\":{\"normal\":{\"x\":1,\"y\":0,\"z\":2.220446049250313e-16},\"constant\":1.9999999999999982}}],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},\"decorGroups\":[{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.06651696650221561,0.5194714665412903,0.10106433001673043,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-6-23 12:20');
INSERT INTO `shares` (`id`, `title`, `user_id`, `design`, `date`) VALUES
('NhnnggQ63cJPNL2456DjS', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":\"22\",\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},\"decorGroups\":[{\"id\":956,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3970822317655518,1.6522049235343084,-2.000276765934846,1],\"name\":\"WS-MAG2-K\",\"sku\":\"WS-MAG2-K\",\"model_class\":\"WineRack\",\"model\":\"WS-MAG2-K.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":1147,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.9095432364089149,1.6522049235343084,-1.9999999898672098,1],\"name\":\"VINV7242M\",\"sku\":\"VINV7242M\",\"model_class\":\"WineRack\",\"model\":\"VINV7242M.glb\",\"default_material\":31,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.995520666241646,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603228,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789996,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.5943277627229693,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890913,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438424,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.609250947833061,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704145,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.0104438513517378,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false},{\"id\":891,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.11405240031190877,1.6522049235343084,-2.00030315539139,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-19 16:43'),
('xP8BKasU_t6TrgaSG0l9m', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1168,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2.9,0,-2,2.9,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},\"decorGroups\":[{\"id\":1085,\"matrix\":[-2.220446049250313e-16,0,1,0,0,1,0,0,-1,0,-2.220446049250313e-16,0,2.9000796917196894,0,-1.6599714111607458,1],\"name\":\"VINL2530DP\",\"sku\":\"VINL2530DP\",\"model_class\":\"WineRack\",\"model\":\"VINL2530.glb\",\"default_material\":28,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":1039,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.207922095669981,0,-2.000301157085488,1],\"name\":\"VINL2075WP\",\"sku\":\"VINL2075WP\",\"model_class\":\"WineRack\",\"model\":\"VINL2075.glb\",\"default_material\":30,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.33420005672791864,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":871,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.5194714665412903,-2.0000119507312775,1],\"name\":\"BLCW26H\",\"sku\":\"BLCW26H\",\"model_class\":\"WineRack\",\"model\":\"BLCW26H.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.3342000567279186,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.1365858637652722,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.7353929602465954,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.537778767283949,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.9389716708026257,0.7791627645492554,-2.0000119507312775,1],\"name\":\"BLCR342_3\",\"sku\":\"BLCR342_3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material\":30,\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-18 9:22'),
('yeFJ_UPX-VSrwnuKCnxRS', '', 0, '{\"version\":\"1.0\",\"server\":\"\",\"language\":\"none\",\"environment\":{\"id\":1169,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"dynamic_room\",\"sku\":\"dynamic_room\",\"model_class\":\"DynamicRoom\",\"model\":\"dynamic_room.glb\",\"default_material\":22,\"default_material_key\":\"floo\",\"snap\":\"\",\"snap_type\":\"environment\",\"includeByDefault\":false,\"metadata\":\"250|-2,0,-2,2,0,-2,2,0,2,-2,0,2,-2,0,-2|0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},\"decorGroups\":[{\"id\":956,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3970822317655518,1.6522049235343084,-2.000276765934846,1],\"name\":\"WS-MAG2-K\",\"sku\":\"WS-MAG2-K\",\"model_class\":\"WineRack\",\"model\":\"WS-MAG2-K.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":1147,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.9095432364089149,1.6522049235343084,-1.9999999898672098,1],\"name\":\"VINV7242M\",\"sku\":\"VINV7242M\",\"model_class\":\"WineRack\",\"model\":\"VINV7242M.glb\",\"default_material\":31,\"default_material_key\":\"wood\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603226,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789993,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.9955206662416458,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.594327762722969,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.6092509478330612,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704147,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":873,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438446,0.3398982286453247,-2.0000119507312775,1],\"name\":\"BLCW52ST\",\"sku\":\"BLCW52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCW52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.010443851351738,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":868,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890915,0,-2.0000119507312775,1],\"name\":\"BLCR342/3\",\"sku\":\"BLCR342/3\",\"model_class\":\"WineRack\",\"model\":\"BLCR342_3.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false,\"mirror\":0},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.995520666241646,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.1931348592042923,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.7979064732789996,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-1.3967135697603228,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.5943277627229693,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.8128296583890913,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.0104438513517378,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,1.4116367548704145,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.609250947833061,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":869,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0.20805804431438424,0.859369695186615,-2.0000119507312775,1],\"name\":\"BLCR52ST\",\"sku\":\"BLCR52ST\",\"model_class\":\"WineRack\",\"model\":\"BLCR52ST.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":891,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,-0.11405240031190877,1.6522049235343084,-2.00030315539139,1],\"name\":\"VCKB0010\",\"sku\":\"VCKB0010\",\"model_class\":\"WineRack\",\"model\":\"VCKB0010.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false},{\"id\":875,\"matrix\":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],\"name\":\"VCKS0080\",\"sku\":\"VCKS0080\",\"model_class\":\"WineRack\",\"model\":\"VCKS0080.glb\",\"default_material_key\":\"\",\"snap\":\"wall\",\"snap_type\":\"\",\"includeByDefault\":false,\"metadata\":\"\",\"added_accessories\":[],\"loadOwnParameters\":true,\"flip\":false}]}', '2022-7-20 14:17');

-- --------------------------------------------------------

--
-- Table structure for table `standard_mat`
--

CREATE TABLE `standard_mat` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'new material',
  `extension` varchar(20) NOT NULL,
  `color_hex` varchar(16) NOT NULL DEFAULT '#CCCCCC',
  `opacity_value` float NOT NULL DEFAULT 1,
  `emissive_hex` varchar(16) NOT NULL DEFAULT '#000000',
  `roughness_value` float NOT NULL DEFAULT 0.5,
  `metalness_value` float NOT NULL DEFAULT 0.5,
  `diffuse_map` varchar(255) DEFAULT NULL,
  `normal_map` varchar(255) DEFAULT NULL,
  `bump_map` varchar(255) DEFAULT NULL,
  `alpha_map` varchar(255) DEFAULT NULL,
  `metalness_map` varchar(255) DEFAULT NULL,
  `roughness_map` varchar(255) DEFAULT NULL,
  `normal_value` float DEFAULT 1,
  `bump_value` float DEFAULT 0.5,
  `category` varchar(255) NOT NULL DEFAULT 'none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `standard_mat`
--

INSERT INTO `standard_mat` (`id`, `title`, `extension`, `color_hex`, `opacity_value`, `emissive_hex`, `roughness_value`, `metalness_value`, `diffuse_map`, `normal_map`, `bump_map`, `alpha_map`, `metalness_map`, `roughness_map`, `normal_value`, `bump_value`, `category`) VALUES
(1, 'White', '10', '#ffffff', 1, '#000000', 0.96, 0, '', 'norm_pine1024.jpg', '', '', '', 'rough_pine1024.jpg', 0.1, 0, 'none'),
(5, 'Black Paint', '', '#000000', 1, '#000000', 0.27, 0, '', '', '', '', '', '', 1, 0.1, 'none'),
(10, 'Chrome', '', '#ffffff', 1, '#000000', 0, 1, '', '', '', NULL, '', '', 1, 0.1, 'none'),
(18, 'Zinc', '', '#c7c7c7', 1, '#000000', 0.48, 1, '', '', '', NULL, NULL, NULL, 1, 0.05, 'none'),
(19, 'White Paint', '', '#ffffff', 1, '#000000', 0.13, 0, '', '', '', NULL, NULL, NULL, 1, 0.05, 'none'),
(22, 'Wooden', '', '#ffffff', 1, '#000000', 0.95, 0, 'WoodFloor01.jpg', 'normals01.jpg', '', NULL, NULL, 'roughness01.jpg', 0.2, 0.05, 'none'),
(23, 'White Painted', '', '#ffffff', 1, '#000000', 0.53, 0, 'whiteFloor.jpg', 'normals01.jpg', '', NULL, NULL, 'roughness01.jpg', 1, 0.05, 'none'),
(25, 'Dark Parquet', '', '#d1d1d1', 1, '#000000', 1, 0.5, 'woodparque.jpg', 'parquetNormal.jpg', '', NULL, NULL, 'parquest_rough.jpg', 0.2, 0.05, 'none'),
(26, 'Standard Pine', 'SP', '#ffffff', 1, '#000000', 0.99, 0, 'SP_diffuse.jpg', '', '', NULL, NULL, 'SP_roughness.jpg', 1, 0.05, 'none'),
(27, 'Black Pine', 'BP', '#ffffff', 1, '#000000', 0.86, 0, 'BP_diffuse.jpg', '', 'BP_bump.jpg', NULL, NULL, 'BP_roughness.jpg', 1, 0.001, 'none'),
(28, 'Dark Pine', 'DP', '#cccccc', 1, '#000000', 0.95, 0, 'DP_diffuse2.jpg', '', '', NULL, NULL, 'DP_roughness.jpg', 1, 0.05, 'none'),
(29, 'Natural Oak', 'NO', '#ffffff', 1, '#000000', 0.96, 0, 'NO_diffuse.jpg', '', 'NO_diffuse.jpg', NULL, NULL, 'NO_diffuse.jpg', 1, 0.0023, 'none'),
(30, 'White Pine', 'WP', '#ffffff', 1, '#000000', 0.98, 0, '', '', 'SP_roughness.jpg', NULL, NULL, 'SP_roughness.jpg', 1, 0.0008, 'none'),
(31, 'veneto', '', '#cc9999', 1, '#000000', 1, 0, 'M_diffuse.jpg', '', '', NULL, NULL, '', 1, 0.05, 'none'),
(32, 'Brick', '', '#ffffff', 1, '#000000', 0.96, 0, 'bricks_diffuse.jpg', 'bricks_normal.jpg', 'bricks_bump.jpg', NULL, NULL, 'bricks_rough.jpg', 1, 0.0247, 'wallpaper'),
(33, 'Painted Brick', '', '#ffffff', 1, '#000000', 1, 0, '', '', 'bricks_bump.jpg', NULL, NULL, 'bricks_rough.jpg', 1, 0.0096, 'wallpaper');

-- --------------------------------------------------------

--
-- Table structure for table `textures`
--

CREATE TABLE `textures` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `texture` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `textures`
--

INSERT INTO `textures` (`id`, `title`, `texture`, `type`) VALUES
(41, 'norm_pine1024', 'norm_pine1024.jpg', 'normal'),
(42, 'rough_pine1024', 'rough_pine1024.jpg', 'bump'),
(43, 'WoodFloor01', 'WoodFloor01.jpg', 'diffuse'),
(44, 'normals01', 'normals01.jpg', 'normal'),
(45, 'roughness01', 'roughness01.jpg', ''),
(46, 'whiteFloor', 'whiteFloor.jpg', 'diffuse'),
(47, 'woodparque', 'woodparque.jpg', 'diffuse'),
(48, 'parquetNormal', 'parquetNormal.jpg', 'normal'),
(49, 'parquest_rough', 'parquest_rough.jpg', ''),
(50, 'SP_diffuse', 'SP_diffuse.jpg', 'diffuse'),
(51, 'SP_roughness', 'SP_roughness.jpg', 'bump'),
(52, 'BP_diffuse', 'BP_diffuse.jpg', 'diffuse'),
(53, 'BP_roughness', 'BP_roughness.jpg', 'normal'),
(54, 'BP_bump', 'BP_bump.jpg', 'bump'),
(55, 'DP_diffuse2', 'DP_diffuse2.jpg', 'diffuse'),
(56, 'DP_roughness', 'DP_roughness.jpg', 'normal'),
(57, 'DP_bump', 'DP_bump.jpg', 'bump'),
(58, 'NO_diffuse', 'NO_diffuse.jpg', 'diffuse'),
(59, 'WP_diffuse', 'WP_diffuse.jpg', 'diffuse'),
(60, 'M_diffuse', 'M_diffuse.jpg', 'diffuse'),
(61, 'M_Roughness', 'M_Roughness.jpg', ''),
(62, 'bricks_diffuse', 'bricks_diffuse.jpg', 'diffuse'),
(63, 'bricks_normal', 'bricks_normal.jpg', 'normal'),
(64, 'bricks_rough', 'bricks_rough.jpg', 'bump'),
(65, 'bricks_bump', 'bricks_bump.jpg', 'bump');

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_type` varchar(20) NOT NULL,
  `da` varchar(255) DEFAULT NULL,
  `nl` varchar(255) DEFAULT NULL,
  `en` varchar(255) DEFAULT NULL,
  `de` varchar(255) DEFAULT NULL,
  `it` varchar(255) DEFAULT NULL,
  `fr` varchar(255) DEFAULT NULL,
  `se` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `translations`
--

INSERT INTO `translations` (`id`, `item_id`, `item_type`, `da`, `nl`, `en`, `de`, `it`, `fr`, `se`) VALUES
(951, 863, 'models', NULL, NULL, NULL, NULL, NULL, NULL, ''),
(952, 53, 'categories', NULL, NULL, 'Le Bloc', NULL, NULL, NULL, 'Le Bloc'),
(953, 866, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(954, 54, 'categories', NULL, NULL, '', NULL, NULL, NULL, ''),
(955, 865, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(956, 867, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(957, 868, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(958, 869, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(959, 870, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(960, 871, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(961, 872, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(962, 873, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(963, 874, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(964, 55, 'categories', NULL, NULL, 'Vintage Classic', NULL, NULL, NULL, 'Vintage Classic'),
(965, 875, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(966, 877, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(967, 56, 'categories', NULL, NULL, 'Vinelli Lazio', NULL, NULL, NULL, 'Vinelli Lazio'),
(968, 878, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(969, 879, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(970, 876, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(971, 880, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(972, 881, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(973, 882, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(974, 883, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(975, 884, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(976, 885, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(977, 886, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(978, 887, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(979, 888, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(980, 889, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(981, 890, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(982, 891, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(983, 892, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(984, 893, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(985, 894, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(986, 895, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(987, 896, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(988, 897, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(989, 898, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(990, 899, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(991, 900, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(992, 903, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(993, 904, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(994, 905, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(995, 906, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(996, 907, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(997, 908, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(998, 909, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(999, 910, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1000, 911, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1001, 912, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1002, 913, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1003, 914, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1004, 915, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1005, 916, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1006, 57, 'categories', NULL, NULL, 'Qbic Classic', NULL, NULL, NULL, 'Qbic Classic'),
(1007, 917, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1008, 918, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1009, 919, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1010, 920, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1011, 921, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1012, 922, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1013, 923, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1014, 924, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1015, 925, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1016, 926, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1017, 927, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1018, 928, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1019, 929, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1020, 930, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1021, 931, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1022, 932, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1023, 933, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1024, 934, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1025, 935, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1026, 936, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1027, 937, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1028, 938, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1029, 939, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1030, 940, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1031, 941, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1032, 58, 'categories', NULL, NULL, 'Vintage View', NULL, NULL, NULL, 'Vintage View'),
(1033, 942, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1034, 943, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1035, 944, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1036, 945, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1037, 946, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1038, 947, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1039, 948, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1040, 949, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1041, 950, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1042, 951, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1043, 952, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1044, 953, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1045, 954, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1046, 955, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1047, 956, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1048, 957, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1049, 958, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1050, 959, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1051, 960, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1052, 961, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1053, 962, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1054, 963, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1055, 965, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1056, 966, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1057, 59, 'categories', NULL, NULL, 'Vinelli Veneto', NULL, NULL, NULL, 'Vinelli Veneto'),
(1058, 968, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1059, 969, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1060, 970, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1061, 964, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1062, 971, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1063, 972, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1064, 973, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1065, 974, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1066, 975, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1067, 976, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1068, 977, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1069, 978, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1070, 979, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1071, 980, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1072, 981, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1073, 982, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1074, 983, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1075, 984, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1076, 985, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1077, 986, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1078, 987, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1079, 988, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1080, 989, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1081, 990, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1082, 991, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1083, 992, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1084, 993, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1085, 994, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1086, 995, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1087, 996, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1088, 997, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1089, 998, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1090, 999, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1091, 1000, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1092, 1001, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1093, 1002, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1094, 1003, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1095, 1004, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1096, 1005, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1097, 1006, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1098, 1007, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1099, 1008, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1100, 1009, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1101, 1010, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1102, 1011, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1103, 1012, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1104, 1013, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1105, 1014, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1106, 1015, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1107, 1016, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1108, 1017, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1109, 1018, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1110, 1019, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1111, 1020, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1112, 1021, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1113, 1022, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1114, 1023, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1115, 1024, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1116, 1025, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1117, 1026, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1118, 1027, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1119, 1028, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1120, 1029, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1121, 1030, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1122, 1031, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1123, 1032, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1124, 1033, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1125, 1034, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1126, 1035, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1127, 1036, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1128, 1037, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1129, 1038, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1130, 1039, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1131, 1040, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1132, 1041, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1133, 1042, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1134, 1043, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1135, 1044, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1136, 1045, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1137, 1046, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1138, 1047, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1139, 1048, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1140, 1049, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1141, 1050, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1142, 1051, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1143, 1052, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1144, 1053, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1145, 1054, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1146, 1055, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1147, 1056, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1148, 1057, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1149, 1058, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1150, 1059, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1151, 1060, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1152, 1061, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1153, 1062, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1154, 1063, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1155, 1064, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1156, 1065, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1157, 1066, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1158, 1067, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1159, 1068, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1160, 1069, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1161, 1070, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1162, 1071, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1163, 1072, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1164, 1073, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1165, 1074, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1166, 1075, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1167, 1076, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1168, 1077, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1169, 1078, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1170, 1079, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1171, 1080, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1172, 1081, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1173, 1082, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1174, 1083, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1175, 1084, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1176, 1085, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1177, 1086, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1178, 1087, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1179, 1088, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1180, 1089, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1181, 1090, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1182, 1091, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1183, 1092, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1184, 1093, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1185, 1094, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1186, 1095, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1187, 1096, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1188, 1097, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1189, 1098, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1190, 1099, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1191, 1100, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1192, 1101, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1193, 1102, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1194, 1103, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1195, 1104, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1196, 1105, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1197, 1106, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1198, 1107, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1199, 1108, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1200, 1109, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1201, 1110, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1202, 1111, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1203, 1112, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1204, 1113, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1205, 1114, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1206, 1115, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1207, 1116, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1208, 1117, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1209, 1118, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1210, 1119, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1211, 1120, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1212, 1121, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1213, 1122, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1214, 1123, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1215, 1124, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1216, 1125, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1217, 1126, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1218, 1127, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1219, 967, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1220, 1128, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1221, 1129, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1222, 1130, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1223, 1131, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1224, 1132, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1225, 1133, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1226, 1134, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1227, 1135, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1228, 1136, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1229, 1137, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1230, 1138, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1231, 1139, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1232, 1140, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1233, 1141, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1234, 1142, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1235, 1143, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1236, 1144, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1237, 1145, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1238, 1146, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1239, 1147, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1240, 1148, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1241, 1149, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1242, 1150, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1243, 1151, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1244, 1152, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1245, 1153, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1246, 1154, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1247, 1155, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1248, 1156, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1249, 1157, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1250, 1158, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1251, 1159, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1252, 1160, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1253, 1161, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1254, 1162, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1255, 60, 'categories', NULL, NULL, 'Bottles', NULL, NULL, NULL, 'Flasker'),
(1256, 1163, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1257, 1164, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1258, 1165, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1259, 1166, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1260, 1167, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1261, 1168, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1262, 1169, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1263, 1170, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1264, 1171, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1265, 61, 'categories', NULL, NULL, 'Doors and Windows', NULL, NULL, NULL, 'Doors and Windows'),
(1266, 1172, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1267, 101, 'accessories', NULL, NULL, 'Doors and Windows', NULL, NULL, NULL, 'Doors and Windows'),
(1268, 1173, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1269, 1174, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1270, 1175, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1271, 1176, 'models', NULL, NULL, '', NULL, NULL, NULL, ''),
(1272, 62, 'categories', NULL, NULL, 'Other', NULL, NULL, NULL, 'Other'),
(1273, 1177, 'models', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `username` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` varchar(25) NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) NOT NULL,
  `merchant_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created`, `role`, `merchant_id`) VALUES
(6, 'peter@devine.pub', 'peter@devine.pub', '$2b$10$O8ffrxky05ECfp/55co7/.0Jv9D4YSQUUtXXlDCRSNuUUx5QEgsHm', '2021-02-22 23:36:43', 'admin', ''),
(17, 'Jens Forsell', 'jens.forsell@granditude.com', '$2b$10$zICG0J18/BW5VOzKIJxbVO5fSVzice3eaHhJLTbVlJh7ODiOOcU1u', '2022-04-07 11:39:02', 'merchant', 'vinlagringse'),
(18, 'Flemming', 'vox@vox-in.dk', '$2b$10$0bymTOu.f3sgplV6DlTgI.kwPmBWQHIUBAAl7ifN2ifOGEBRywL2a', '2022-05-23 14:01:14', 'admin', '');

-- --------------------------------------------------------

--
-- Table structure for table `vinlagringse`
--

CREATE TABLE `vinlagringse` (
  `id` int(10) NOT NULL,
  `model_id` varchar(255) NOT NULL,
  `webshop_id` varchar(255) NOT NULL,
  `configurable` int(10) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accessories`
--
ALTER TABLE `accessories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designs`
--
ALTER TABLE `designs`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shares`
--
ALTER TABLE `shares`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `standard_mat`
--
ALTER TABLE `standard_mat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `textures`
--
ALTER TABLE `textures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vinlagringse`
--
ALTER TABLE `vinlagringse`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accessories`
--
ALTER TABLE `accessories`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1178;

--
-- AUTO_INCREMENT for table `standard_mat`
--
ALTER TABLE `standard_mat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `textures`
--
ALTER TABLE `textures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1274;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `vinlagringse`
--
ALTER TABLE `vinlagringse`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
