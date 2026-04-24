/**
 * Миграция каталога из bouquets-data.js + roses-data.js в MySQL (схема db/schema.sql).
 *
 *   npm install
 *   npm run migrate              — заливка в БД из .env
 *   npm run migrate:sql          — только файл db/migrate-seed.sql (без подключения)
 *
 * Требуется .env в корне проекта (см. config/database.env.example).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SQL_OUT = path.join(ROOT, "db", "migrate-seed.sql");

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) {
    console.warn("Файл .env не найден. Скопируйте config/database.env.example → .env");
    return;
  }
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
}

function runJsFile(relPath) {
  const full = path.join(ROOT, relPath);
  const code = fs.readFileSync(full, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: relPath });
  return sandbox.window;
}

function kindFromExternalId(externalId) {
  if (externalId.startsWith("bq-")) return "bouquet";
  if (externalId.startsWith("oc-")) return "rose";
  return "other";
}

function rowFromProduct(externalId, p) {
  return {
    external_id: externalId,
    kind: kindFromExternalId(externalId),
    name: p.name || "",
    description: p.desc != null ? String(p.desc) : null,
    price_rub: Number.isFinite(p.price) ? Math.max(0, Math.floor(p.price)) : 0,
    price_label: p.priceStr != null ? String(p.priceStr) : null,
    image_url: p.imageUrl != null ? String(p.imageUrl) : null,
    product_url: p.productUrl != null ? String(p.productUrl) : null,
    img_variant: Number.isFinite(p.img) ? Math.min(255, Math.max(0, Math.floor(p.img))) : 1,
    badge: p.badge != null && p.badge !== "" ? String(p.badge) : null,
    badge_class: p.badgeClass != null && p.badgeClass !== "" ? String(p.badgeClass) : null,
  };
}

function sqlEscape(str) {
  if (str == null) return "NULL";
  return (
    "'" +
    String(str)
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "''")
      .replace(/\u0000/g, "")
      .replace(/\r?\n/g, "\\n") +
    "'"
  );
}

function buildSqlStatements(productsMap, idLists) {
  const lines = [
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
    "-- products (UPSERT по external_id)",
  ];

  const insertHeader =
    "INSERT INTO `products` (`external_id`,`kind`,`name`,`description`,`price_rub`,`price_label`,`image_url`,`product_url`,`img_variant`,`badge`,`badge_class`) VALUES ";

  const rows = [];
  for (const [extId, p] of Object.entries(productsMap)) {
    const r = rowFromProduct(extId, p);
    rows.push(
      `(${sqlEscape(r.external_id)},${sqlEscape(r.kind)},${sqlEscape(r.name)},${sqlEscape(r.description)},${r.price_rub},${sqlEscape(r.price_label)},${sqlEscape(r.image_url)},${sqlEscape(r.product_url)},${r.img_variant},${sqlEscape(r.badge)},${sqlEscape(r.badge_class)})`,
    );
  }
  lines.push(
    insertHeader +
      rows.join(",\n") +
      `
ON DUPLICATE KEY UPDATE
  \`kind\` = VALUES(\`kind\`),
  \`name\` = VALUES(\`name\`),
  \`description\` = VALUES(\`description\`),
  \`price_rub\` = VALUES(\`price_rub\`),
  \`price_label\` = VALUES(\`price_label\`),
  \`image_url\` = VALUES(\`image_url\`),
  \`product_url\` = VALUES(\`product_url\`),
  \`img_variant\` = VALUES(\`img_variant\`),
  \`badge\` = VALUES(\`badge\`),
  \`badge_class\` = VALUES(\`badge_class\`);`,
  );

  lines.push("", "-- product_category: очистка списков витрины букетов");
  lines.push(
    "DELETE pc FROM `product_category` pc INNER JOIN `categories` c ON c.id = pc.category_id WHERE c.slug IN ('all','roses','chrys','mixed');",
  );
  lines.push("", "-- product_category: вставка порядка из bouquets-data.js");

  const slugs = ["all", "roses", "chrys", "mixed"];
  for (const slug of slugs) {
    const ids = idLists[slug];
    if (!Array.isArray(ids)) continue;
    let pos = 0;
    for (const extId of ids) {
      if (!productsMap[extId]) continue;
      lines.push(
        `INSERT INTO \`product_category\` (\`product_id\`,\`category_id\`,\`sort_order\`) SELECT p.id, c.id, ${pos} FROM \`products\` p INNER JOIN \`categories\` c ON c.slug = ${sqlEscape(slug)} WHERE p.external_id = ${sqlEscape(extId)} ON DUPLICATE KEY UPDATE \`sort_order\` = VALUES(\`sort_order\`);`,
      );
      pos += 1;
    }
  }

  lines.push("", "SET FOREIGN_KEY_CHECKS = 1;");
  return lines.join("\n");
}

async function migrateWithMysql2(sqlText) {
  let mysql2;
  try {
    mysql2 = require("mysql2/promise");
  } catch {
    console.error("Установите зависимости: npm install");
    process.exit(1);
  }

  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT || "3306", 10);
  const database = process.env.DB_NAME || "cv028576_llmflo";
  const user = process.env.DB_USER || "";
  const password = process.env.DB_PASSWORD || process.env.DB_PASS || "";

  if (!user) {
    console.error("В .env задайте DB_USER");
    process.exit(1);
  }

  const conn = await mysql2.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });

  await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
  await conn.beginTransaction();
  try {
    await conn.query(sqlText);
    await conn.commit();
    console.log("Миграция выполнена:", database);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    await conn.end();
  }
}

async function main() {
  const sqlOnly = process.argv.includes("--sql-only");

  loadEnv();

  const bWin = runJsFile("bouquets-data.js");
  const bouquets = bWin.FLORISTA_BOUQUET_PRODUCTS;
  const idLists = bWin.FLORISTA_BOUQUET_ID_LISTS;
  if (!bouquets || !idLists) {
    console.error("Не удалось прочитать bouquets-data.js (window.FLORISTA_BOUQUET_*)");
    process.exit(1);
  }

  const rWin = runJsFile("roses-data.js");
  const roses = rWin.FLORISTA_ROSE_PRODUCTS;
  if (!roses) {
    console.error("Не удалось прочитать roses-data.js (window.FLORISTA_ROSE_PRODUCTS)");
    process.exit(1);
  }

  const productsMap = { ...bouquets, ...roses };
  const sqlText = buildSqlStatements(productsMap, idLists);

  fs.writeFileSync(SQL_OUT, sqlText, "utf8");
  console.log("SQL сохранён:", SQL_OUT);

  if (sqlOnly) {
    console.log("Режим --sql-only: в БД не писали. Импорт вручную: mysql -u USER -p DB < db/migrate-seed.sql");
    return;
  }

  await migrateWithMysql2(sqlText);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
