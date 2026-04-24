const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..");
const files = [
  { file: "bouquets-scrape-1.html", listKey: "all" },
  { file: "bouquets-scrape-2.html", listKey: "roses" },
  { file: "bouquets-scrape-3.html", listKey: "chrys" },
  { file: "bouquets-scrape-4.html", listKey: "mixed" },
];

function parsePriceBlock(html) {
  const mNew = html.match(/<span class="price-new">([^<]+)<\/span>\s*<span class="price-old">([^<]+)<\/span>/);
  if (mNew) {
    return { priceStr: mNew[1].trim() + " (было " + mNew[2].trim() + ")", price: parseInt(mNew[1].replace(/[,.\s]/g, ""), 10) };
  }
  const m1 = html.match(/<p class="price">\s*([0-9,.\s]+₽)\s*<\/p>/s);
  if (m1) {
    const s = m1[1].replace(/[,.\s]/g, "");
    const n = parseInt(s, 10);
    return { priceStr: m1[1].trim().replace(/\s+/g, " "), price: n };
  }
  return { priceStr: "—", price: 0 };
}

function parseBlock(block) {
  const imgM = block.match(/<img src="(https:[^"]+)" alt="([^"]*)/);
  if (!imgM) return null;
  const imageUrl = imgM[1];
  const name = imgM[2]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  const linkM = block.match(/<h4><a href="([^"]+)">[^<]+<\/a><\/h4>/);
  const productUrl = linkM
    ? linkM[1].replace("http://", "https://").replace(/\s+$/g, "").trim()
    : "";
  const descM = block.match(/<p style="display: none">([^<]*)<\/p>/);
  const desc = descM
    ? descM[1].replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/\.\.+/g, "…").trim()
    : "Букет из каталога Florista.";
  const cartM = block.match(/cart\.add\('(\d+)'/);
  if (!cartM) return null;
  const ocId = cartM[1];
  const price = parsePriceBlock(block);
  const isSale = block.includes("special") && block.includes("Акция");
  return {
    ocId,
    name,
    imageUrl,
    productUrl,
    desc,
    priceStr: price.priceStr,
    price: price.price,
    isSale,
    badge: isSale ? "Акция" : null,
    badgeClass: isSale ? "text-bg-warning" : null,
  };
}

function parseFile(p) {
  const html = fs.readFileSync(p, "utf8");
  const out = [];
  const parts = html.split(/<div class="product-layout layout-height product-list/);
  for (let i = 1; i < parts.length; i++) {
    const b = "product-layout" + parts[i].split('</div>\n        </div>\n                <div class="product-layout')[0];
    if (!b.includes("product-thumb")) continue;
    const block = b;
    const row = parseBlock(block);
    if (row) out.push(row);
  }
  return out;
}

const byId = new Map();
const listIds = { all: [], roses: [], chrys: [], mixed: [] };

for (const { file, listKey } of files) {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) {
    console.error("Missing", fp);
    process.exit(1);
  }
  const rows = parseFile(fp);
  for (const r of rows) {
    const key = "bq-" + r.ocId;
    if (!byId.has(key)) {
      byId.set(key, { ...r, id: key });
    }
    listIds[listKey].push(key);
  }
}

for (const k of Object.keys(listIds)) {
  listIds[k] = [...new Set(listIds[k])];
}

const products = Object.fromEntries([...byId.values()].map((v) => [v.id, v]));

const e = (s) => JSON.stringify(s);
const toJsObj = (pobj) => {
  const lines = Object.keys(pobj).map((k) => {
    const v = pobj[k];
    let s = e(k) + ": { name: " + e(v.name) + ", price: " + v.price + ", priceStr: " + e(v.priceStr) + ", desc: " + e(v.desc) + ", imageUrl: " + e(v.imageUrl) + ", productUrl: " + e(v.productUrl) + ", img: 2";
    if (v.badge) s += ", badge: " + e(v.badge);
    if (v.badgeClass) s += ", badgeClass: " + e(v.badgeClass);
    s += " }";
    return s;
  });
  return "{\n        " + lines.join(",\n        ") + "\n      }";
};

console.log("Parsed products:", byId.size);
fs.writeFileSync(
  path.join(dir, "bouquets-lists.json"),
  JSON.stringify({ listIds, productKeys: Object.keys(products) }, null, 2),
  "utf8",
);

const pJs = toJsObj(products);
const listJs = JSON.stringify(listIds, null, 2);

const outSrc = `/**
 * Букеты: данные с витрин Florista (снимок).
 * - https://florista.tomsk.ru/bouquets
 * - https://florista.tomsk.ru/bouquets_of_roses
 * - https://florista.tomsk.ru/Bouquets_of_flowers
 * - https://florista.tomsk.ru/mixed-bouquet
 */
(function () {
  const FLORISTA_BOUQUET_PRODUCTS = ${pJs};

  const idLists = ${listJs};

  window.FLORISTA_BOUQUET_PRODUCTS = FLORISTA_BOUQUET_PRODUCTS;
  window.FLORISTA_BOUQUET_ID_LISTS = idLists;
  window.FLORISTA_BOUQUETS = Object.fromEntries(
    Object.keys(FLORISTA_BOUQUET_PRODUCTS).map((k) => {
      const p = FLORISTA_BOUQUET_PRODUCTS[k];
      return [k, { name: p.name, price: p.price, img: p.img, imageUrl: p.imageUrl }];
    }),
  );
})();

`;
fs.writeFileSync(path.join(dir, "bouquets-data.js"), outSrc, "utf8");
console.log("Wrote bouquets-data.js and bouquets-lists.json");
