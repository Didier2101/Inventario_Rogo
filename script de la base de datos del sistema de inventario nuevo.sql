-- MySQL Script generated by MySQL Workbench
-- Sun Jul 14 14:24:58 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema sistema_inventario
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sistema_inventario
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sistema_inventario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `sistema_inventario` ;

-- -----------------------------------------------------
-- Table `sistema_inventario`.`cargos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`cargos` (
  `id_cargo` INT NOT NULL AUTO_INCREMENT,
  `nombre_cargo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_cargo`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`empleados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`empleados` (
  `id_empleado` INT NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(45) NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `correo_electronico` VARCHAR(100) NOT NULL,
  `estado` TINYINT(1) NULL DEFAULT '1',
  `salario` DECIMAL(10,2) NOT NULL,
  `id_cargo` INT NOT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE,
  INDEX `fk_empleado_cargo_idx` (`id_cargo` ASC) VISIBLE,
  CONSTRAINT `fk_empleado_cargo`
    FOREIGN KEY (`id_cargo`)
    REFERENCES `sistema_inventario`.`cargos` (`id_cargo`))
ENGINE = InnoDB
AUTO_INCREMENT = 71
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`bodegas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`bodegas` (
  `id_bodega` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `encargado` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_bodega`),
  INDEX `fk_encargado_empleado_idx` (`encargado` ASC) VISIBLE,
  CONSTRAINT `fk_encargado_empleado`
    FOREIGN KEY (`encargado`)
    REFERENCES `sistema_inventario`.`empleados` (`id_empleado`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(100) NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  `direccion` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `proveedor` INT NULL DEFAULT NULL,
  `bodega` INT NULL DEFAULT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `referencia` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `precio_compra` DECIMAL(10,2) NOT NULL,
  `precio_venta` DECIMAL(10,2) NOT NULL,
  `cantidad` INT NOT NULL,
  `estado` TINYINT NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_producto`),
  UNIQUE INDEX `referencia_UNIQUE` (`referencia` ASC) VISIBLE,
  INDEX `fk_producto_proveedor_idx` (`proveedor` ASC) VISIBLE,
  INDEX `fk_producto_ubicacion_idx` (`bodega` ASC) VISIBLE,
  CONSTRAINT `fk_producto_ubicacion`
    FOREIGN KEY (`bodega`)
    REFERENCES `sistema_inventario`.`bodegas` (`id_bodega`))
ENGINE = InnoDB
AUTO_INCREMENT = 80
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`proveedores` (
  `id_proveedor` INT NOT NULL AUTO_INCREMENT,
  `nit` VARCHAR(45) NOT NULL,
  `empresa` VARCHAR(45) NOT NULL,
  `cedula` VARCHAR(100) NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  `direccion` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE,
  INDEX `fk_proveedor_persona_idx` (`id_proveedor` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`puntos_ventas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`puntos_ventas` (
  `id_punto_venta` INT NOT NULL AUTO_INCREMENT,
  `nombre_punto_venta` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `encargado` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_punto_venta`),
  INDEX `fk_encargado_empleado_idx` (`encargado` ASC) VISIBLE,
  CONSTRAINT `fk_punto_venta_empleado`
    FOREIGN KEY (`encargado`)
    REFERENCES `sistema_inventario`.`empleados` (`id_empleado`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `sistema_inventario`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistema_inventario`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(100) NOT NULL,
  `id_empleado` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  INDEX `fk_usuario_empleado_idx` (`id_empleado` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_empleado`
    FOREIGN KEY (`id_empleado`)
    REFERENCES `sistema_inventario`.`empleados` (`id_empleado`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
