/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank Struktur für esx_legacy
CREATE DATABASE IF NOT EXISTS `esx_legacy` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
USE `esx_legacy`;

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse
DROP TABLE IF EXISTS `greenhouse`;
CREATE TABLE IF NOT EXISTS `greenhouse` (
  `pgh_id` int(11) NOT NULL AUTO_INCREMENT,
  `price` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `coords` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '{}',
  `entry` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '{}' COMMENT 'currently unused',
  `exit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '{}' COMMENT 'currently unused',
  `maxCargo` int(11) DEFAULT 10000 COMMENT 'cargo in g',
  `zones` int(11) DEFAULT 4,
  PRIMARY KEY (`pgh_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse: ~13 rows (ungefähr)
INSERT INTO `greenhouse` (`pgh_id`, `price`, `name`, `label`, `coords`, `entry`, `exit`, `maxCargo`, `zones`) VALUES
	(1, 1610, 'greenhouse_1', 'Gewächshaus 1', '{"x": -198.04,"y": -1711.85,"z": 32.66}', '{}', '{}', 100000, 4),
	(2, 1610, 'greenhouse_2', 'Gewächshaus 2', '{"x": 448.39,"y": -2761.42,"z": 7.1}', '{}', '{}', 100000, 4),
	(3, 1610, 'greenhouse_3', 'Gewächshaus 3', '{"x": -3158.46, "y": 1125.64, "z":20.85}', '{}', '{}', 100000, 4),
	(4, 1610, 'greenhouse_4', 'Gewächshaus 4', '{"x": -253.74,"y": 304.81,"z": 92.11}', '{}', '{}', 100000, 4),
	(5, 1610, 'greenhouse_5', 'Gewächshaus 5', '{"x":-1129.32,"y": -1223.81,"z": 3.0}', '{}', '{}', 100000, 4),
	(6, 4427, 'greenhouse_6', 'Gewächshaus 6', '{"x": -127.62,"y": 1922.16,"z": 197.31}', '{}', '{}', 100000, 11),
	(7, 402, 'greenhouse_7', 'Gewächshaus 7', '{"x": 257.73,"y":  3091.29,"z":  42.8}', '{}', '{}', 100000, 1),
	(8, 8050, 'greenhouse_8', 'Gewächshaus 8', '{"x": 1901.09,"y":  4916.97,"z":  48.77}', '{}', '{}', 100000, 20),
	(9, 2415, 'greenhouse_9', 'Gewächshaus 8', '{"x": 3304.17,"y":  5184.81,"z":  19.71}', '{}', '{}', 100000, 6),
	(10, 7245, 'greenhouse_10', 'Gewächshaus 10', '{"x": 433.94,"y":  6464.67,"z":  28.75}', '{}', '{}', 100000, 18),
	(11, 1500, 'greenhouse_11', 'Gewächshaus 11', '{"x": 408.22,"y":  6498.15,"z":  27.74}', '{}', '{}', 100000, 24),
	(12, 2415, 'greenhouse_12', 'Gewächshaus 13', '{"x": 159.03,"y": 3129.91,"z": 43.58}', '{}', '{}', 100000, 6),
	(13, 1610, 'greenhouse_13', 'Gewächshaus 13', '{"x": 1161.35,"y": -1312.83,"z": 34.74}', '{}', '{}', 100000, 4);

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_cargo
DROP TABLE IF EXISTS `greenhouse_cargo`;
CREATE TABLE IF NOT EXISTS `greenhouse_cargo` (
  `pgh_c_id` int(11) NOT NULL AUTO_INCREMENT,
  `pgh_c_amount` int(11) NOT NULL DEFAULT 1,
  `f_pgh_p_id` int(11) NOT NULL DEFAULT 1 COMMENT 'table: greenhouse_plants',
  `f_pgh_ct_id` int(11) DEFAULT 1 COMMENT 'table: greenhouse_cargo_types',
  `f_pgh_id` int(11) DEFAULT 1 COMMENT 'table: greenhouse',
  `f_identifier` varchar(46) DEFAULT NULL,
  PRIMARY KEY (`pgh_c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_cargo: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_cargo_types
DROP TABLE IF EXISTS `greenhouse_cargo_types`;
CREATE TABLE IF NOT EXISTS `greenhouse_cargo_types` (
  `pgh_ct_id` int(11) NOT NULL AUTO_INCREMENT,
  `pgh_ct_name` varchar(50) NOT NULL DEFAULT '0',
  `pgh_ct_lable` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pgh_ct_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_cargo_types: ~2 rows (ungefähr)
INSERT INTO `greenhouse_cargo_types` (`pgh_ct_id`, `pgh_ct_name`, `pgh_ct_lable`) VALUES
	(1, 'crop', 'Ernte'),
	(2, 'seed', 'Saatgut');

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_owner
DROP TABLE IF EXISTS `greenhouse_owner`;
CREATE TABLE IF NOT EXISTS `greenhouse_owner` (
  `pgh_o_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_identifier` varchar(46) NOT NULL DEFAULT '0' COMMENT 'table: users',
  `f_pgh_id` int(11) NOT NULL DEFAULT 0 COMMENT 'table: greenhouse',
  PRIMARY KEY (`pgh_o_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_owner: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_plants
DROP TABLE IF EXISTS `greenhouse_plants`;
CREATE TABLE IF NOT EXISTS `greenhouse_plants` (
  `pgh_p_id` int(11) NOT NULL AUTO_INCREMENT,
  `pgh_p_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_p_label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_p_price` int(11) NOT NULL DEFAULT 0,
  `pgh_p_sellprice` double NOT NULL DEFAULT 0 COMMENT 'pro 1000g',
  `pgh_p_maxProduce` int(11) NOT NULL DEFAULT 0 COMMENT 'amount',
  `pgh_p_weight` int(11) DEFAULT NULL,
  `p_weight` int(11) DEFAULT NULL,
  `f_pgh_id` int(11) NOT NULL DEFAULT 0 COMMENT 'table: greenhouse',
  PRIMARY KEY (`pgh_p_id`),
  KEY `f_pgh_id` (`f_pgh_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_plants: ~2 rows (ungefähr)
INSERT INTO `greenhouse_plants` (`pgh_p_id`, `pgh_p_name`, `pgh_p_label`, `pgh_p_price`, `pgh_p_sellprice`, `pgh_p_maxProduce`, `pgh_p_weight`, `p_weight`, `f_pgh_id`) VALUES
	(1, 'hanf', 'Hanf', 20, 12500, 12, 1, 5, 7),
	(2, 'tomato', 'Tomaten', 4, 180, 6, 200, 5, 7);

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_plants_stages
DROP TABLE IF EXISTS `greenhouse_plants_stages`;
CREATE TABLE IF NOT EXISTS `greenhouse_plants_stages` (
  `pgh_ps_id` int(11) NOT NULL AUTO_INCREMENT,
  `pgh_ps_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_ps_label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_ps_duration` int(11) NOT NULL DEFAULT 0 COMMENT 'in min',
  PRIMARY KEY (`pgh_ps_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_plants_stages: ~4 rows (ungefähr)
INSERT INTO `greenhouse_plants_stages` (`pgh_ps_id`, `pgh_ps_name`, `pgh_ps_label`, `pgh_ps_duration`) VALUES
	(1, 'grow_1', 'Stufe I', 30),
	(2, 'grow_2', 'Stufe II', 30),
	(3, 'grow_3', 'Stufe III', 30),
	(4, 'grow_4', 'Stufe IV', 30);

-- Exportiere Struktur von Tabelle esx_legacy.greenhouse_plants_zones
DROP TABLE IF EXISTS `greenhouse_plants_zones`;
CREATE TABLE IF NOT EXISTS `greenhouse_plants_zones` (
  `pgh_z_id` int(11) NOT NULL AUTO_INCREMENT,
  `pgh_z_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_z_label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `pgh_z_amount` int(11) DEFAULT 0,
  `pgh_z_planted` varchar(50) DEFAULT NULL,
  `pgh_z_last_growed` varchar(50) DEFAULT NULL,
  `f_pgh_p_id` int(11) NOT NULL DEFAULT 0 COMMENT 'table: greenhouse_plants',
  `f_pgh_ps_id` int(11) NOT NULL DEFAULT 0 COMMENT 'table: greenhouse_plants_stages',
  `f_pgh_id` int(11) NOT NULL DEFAULT 0 COMMENT 'table: greenhouse',
  `f_identifier` varchar(46) DEFAULT NULL COMMENT 'table: users',
  PRIMARY KEY (`pgh_z_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='resource: esx_greenhouse';

-- Exportiere Daten aus Tabelle esx_legacy.greenhouse_plants_zones: ~0 rows (ungefähr)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
