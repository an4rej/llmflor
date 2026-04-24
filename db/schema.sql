-- MySQL 8.0, база: cv028576_llmflo
-- Схема под данные из bouquets-data.js, bouquets-lists.json, roses-data.js и оформление заказов.
-- Импорт: mysql -u USER -p cv028576_llmflo < db/schema.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Разделы витрины (all, roses, chrys, mixed — как listIds в bouquets-lists.json)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `product_category`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id`            SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`          VARCHAR(64)  NOT NULL COMMENT 'Ключ списка: all, roses, chrys, mixed',
  `title`         VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Человекочитаемое название раздела',
  `sort_order`    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Товары: букеты (bq-*), розы/каталог (oc-*), позже — любые external_id
-- ---------------------------------------------------------------------------
CREATE TABLE `products` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `external_id`     VARCHAR(64)  NOT NULL COMMENT 'Ключ как в JS: bq-240, oc-255',
  `kind`            ENUM('bouquet','rose','other') NOT NULL DEFAULT 'other',
  `name`            VARCHAR(512) NOT NULL,
  `description`     TEXT NULL COMMENT 'desc в витрине',
  `price_rub`       INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Число из price',
  `price_label`     VARCHAR(128) NULL COMMENT 'priceStr для отображения',
  `image_url`       VARCHAR(2048) NULL,
  `product_url`     VARCHAR(2048) NULL,
  `img_variant`     TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'поле img в данных',
  `badge`           VARCHAR(64) NULL,
  `badge_class`     VARCHAR(64) NULL,
  `metadata`        JSON NULL COMMENT 'Произвольные поля при миграции',
  `is_active`       TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_external_id` (`external_id`),
  KEY `idx_products_kind` (`kind`),
  KEY `idx_products_active_price` (`is_active`, `price_rub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Принадлежность товара к разделу и порядок в списке (как массивы listIds)
-- ---------------------------------------------------------------------------
CREATE TABLE `product_category` (
  `product_id`   INT UNSIGNED NOT NULL,
  `category_id`  SMALLINT UNSIGNED NOT NULL,
  `sort_order`   INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Позиция в списке раздела',
  PRIMARY KEY (`product_id`, `category_id`),
  KEY `idx_pc_category_sort` (`category_id`, `sort_order`),
  CONSTRAINT `fk_pc_product`  FOREIGN KEY (`product_id`)  REFERENCES `products` (`id`)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Заказы (под будущий перенос с checkout / корзины)
-- ---------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `public_ref`      CHAR(12) NOT NULL COMMENT 'Короткий номер для клиента',
  `status`          ENUM('new','accepted','in_progress','delivered','cancelled') NOT NULL DEFAULT 'new',
  `customer_name`   VARCHAR(255) NULL,
  `phone`           VARCHAR(64) NOT NULL,
  `email`           VARCHAR(255) NULL,
  `delivery_city`   VARCHAR(128) NULL,
  `delivery_address` VARCHAR(512) NULL,
  `delivery_slot`   VARCHAR(255) NULL,
  `comment`         TEXT NULL,
  `total_rub`       INT UNSIGNED NOT NULL DEFAULT 0,
  `currency`        CHAR(3) NOT NULL DEFAULT 'RUB',
  `payload`         JSON NULL COMMENT 'Сырой снимок корзины / поля формы',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_public_ref` (`public_ref`),
  KEY `idx_orders_status_created` (`status`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`      BIGINT UNSIGNED NOT NULL,
  `product_id`    INT UNSIGNED NULL COMMENT 'NULL если товар удалили из каталога',
  `external_id`   VARCHAR(64) NOT NULL COMMENT 'Снимок ключа bq-*/oc-* на момент заказа',
  `name`          VARCHAR(512) NOT NULL,
  `unit_price_rub` INT UNSIGNED NOT NULL,
  `qty`           SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `line_total_rub` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_oi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Стартовые разделы (под bouquets-lists.json)
-- ---------------------------------------------------------------------------
INSERT INTO `categories` (`slug`, `title`, `sort_order`) VALUES
  ('all',   'Все букеты',     10),
  ('roses', 'Розы',           20),
  ('chrys', 'Хризантемы',     30),
  ('mixed', 'Сборные букеты', 40)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `sort_order` = VALUES(`sort_order`);
