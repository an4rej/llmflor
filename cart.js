/**
 * Florista: корзина (localStorage) + мини-корзина в шапке.
 */
(function () {
  const STORAGE_KEY = "floristaCartV1";

  const CATALOG = Object.assign(
    {
      "nezhnyy-rassvet": { name: "Нежный рассвет", price: 2990, img: 1 },
      "granat-sneg": { name: "Гранатовый снег", price: 2490, img: 2 },
      "lavand-vozduh": { name: "Лавандовый воздух", price: 3390, img: 3 },
      "belaya-geometriya": { name: "Белая геометрия", price: 2790, img: 4 },
      "solnech-vayb": { name: "Солнечный вайб", price: 1990, img: 5 },
      "nochnoy-sad": { name: "Ночной сад", price: 4490, img: 6 },
    },
    typeof window !== "undefined" && window.FLORISTA_ROSES ? window.FLORISTA_ROSES : {},
    typeof window !== "undefined" && window.FLORISTA_BOUQUETS ? window.FLORISTA_BOUQUETS : {},
  );

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function lineSum(line) {
    return line.qty * line.price;
  }

  function cartTotal(items) {
    return items.reduce((s, l) => s + lineSum(l), 0);
  }

  function formatRub(n) {
    return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
      n,
    ) + " \u00a0₽";
  }

  function getMeta(productId) {
    return CATALOG[productId] || null;
  }

  function addProduct(productId) {
    const meta = getMeta(productId);
    if (!meta) return;
    const cart = getCart();
    const i = cart.findIndex((l) => l.id === productId);
    if (i >= 0) cart[i].qty += 1;
    else {
      cart.push({
        id: productId,
        name: meta.name,
        price: meta.price,
        img: meta.img,
        imageUrl: meta.imageUrl || null,
        qty: 1,
      });
    }
    setCart(cart);
  }

  function setQty(productId, qty) {
    let cart = getCart();
    const q = Math.max(0, Math.min(99, Math.floor(qty)));
    if (q === 0) cart = cart.filter((l) => l.id !== productId);
    else {
      const i = cart.findIndex((l) => l.id === productId);
      if (i >= 0) cart[i].qty = q;
    }
    setCart(cart);
  }

  function clearCart() {
    setCart([]);
  }

  function showCartDropdown() {
    const el = document.getElementById("floristaCartBtn");
    if (el && window.bootstrap) {
      const d = window.bootstrap.Dropdown.getOrCreateInstance(el);
      d.show();
    }
  }

  function updateUI() {
    const items = getCart();
    const count = items.reduce((s, l) => s + l.qty, 0);
    const total = cartTotal(items);

    const elCount = document.getElementById("floristaCartCount");
    const elBtn = document.getElementById("floristaCartBtn");
    const elList = document.getElementById("floristaCartList");
    const elEmpty = document.getElementById("floristaCartEmpty");
    const elFooter = document.getElementById("floristaCartFooter");
    const elTotal = document.getElementById("floristaCartTotal");

    if (elCount) {
      if (count > 0) {
        elCount.removeAttribute("hidden");
        elCount.textContent = String(count > 99 ? "99+" : count);
      } else {
        elCount.setAttribute("hidden", "");
        elCount.textContent = "0";
      }
    }

    if (elBtn) {
      elBtn.setAttribute("aria-label", "Корзина. Товаров: " + String(count));
    }

    if (elList) {
      const safeId = (id) => escAttr(id);
      elList.innerHTML = items
        .map((line) => {
          const thumb =
            line.imageUrl
              ? '<div class="mini-cart__thumb mini-cart__thumb--img" aria-hidden="true"><img src="' +
                escAttr(line.imageUrl) +
                '" alt="" width="48" height="48" loading="lazy" decoding="async" /></div>'
              : '<div class="mini-cart__thumb" aria-hidden="true"><div class="product-img product-img--' +
                String(line.img) +
                '"></div></div>';
          return (
            '<div class="mini-cart__row d-flex gap-2 align-items-center py-2 px-1">' +
            thumb +
            '<div class="flex-grow-1 min-w-0">' +
            '<div class="fw-semibold text-truncate small mb-0">' +
            esc(line.name) +
            "</div>" +
            "<div class=\"text-secondary small\">" +
            esc(formatRub(line.price)) +
            " \u00d7 " +
            String(line.qty) +
            "</div></div>" +
            '<div class="d-flex flex-column align-items-end gap-1 flex-shrink-0">' +
            '<div class="btn-group btn-group-sm" role="group" aria-label="Количество: ' +
            safeId(line.name) +
            '">' +
            '<button type="button" class="btn btn-light border py-0 px-2" data-florista-delta="-1" data-florista-pid="' +
            safeId(line.id) +
            '" aria-label="Меньше">−</button>' +
            '<button type="button" class="btn btn-light border py-0 px-2" data-florista-delta="1" data-florista-pid="' +
            safeId(line.id) +
            '" aria-label="Больше">+</button>' +
            "</div>" +
            "<button type=\"button\" class=\"btn btn-link text-secondary btn-sm p-0 small text-decoration-none\" data-florista-remove=\"" +
            safeId(line.id) +
            '">Убрать</button>' +
            "</div></div>"
          );
        })
        .join("");
    }

    if (elEmpty) {
      if (items.length) elEmpty.setAttribute("hidden", "");
      else elEmpty.removeAttribute("hidden");
    }

    if (elFooter) {
      if (items.length) {
        elFooter.removeAttribute("hidden");
      } else {
        elFooter.setAttribute("hidden", "");
      }
    }

    if (elTotal) {
      elTotal.textContent = formatRub(total);
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function onAddClick(e) {
    const btn = e.target.closest("[data-florista-add]");
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute("data-florista-id");
    if (!id) return;
    if (!getMeta(id)) {
      return;
    }
    addProduct(id);
    updateUI();
    showCartDropdown();
  }

  document.addEventListener("click", onAddClick, true);

  document.addEventListener("click", function (e) {
    const q = e.target.closest("[data-florista-delta][data-florista-pid]");
    if (q) {
      e.preventDefault();
      const id = q.getAttribute("data-florista-pid");
      const delta = Number(q.getAttribute("data-florista-delta") || 0);
      if (!id || !delta) return;
      const cart = getCart();
      const line = cart.find((l) => l.id === id);
      if (!line) return;
      setQty(id, line.qty + delta);
      updateUI();
      return;
    }
    const rm = e.target.closest("[data-florista-remove]");
    if (rm) {
      e.preventDefault();
      setQty(rm.getAttribute("data-florista-remove") || "", 0);
      updateUI();
      return;
    }
    if (e.target.id === "floristaCartClear" || e.target.closest("#floristaCartClear")) {
      e.preventDefault();
      clearCart();
      updateUI();
    }
  });

  function prefillOrderNote() {
    const items = getCart();
    if (!items.length) return;
    const note = document.getElementById("orderNote");
    if (!note) return;
    if (note.value.trim() !== "") return;
    const lines = items
      .map(
        (l) =>
          "– " + l.name + " × " + l.qty + " = " + formatRub(lineSum(l)),
      )
      .join("\n");
    note.value = "Состав корзины:\n" + lines;
  }

  document.addEventListener("show.bs.modal", function (e) {
    if (e.target && e.target.id === "orderModal") {
      prefillOrderNote();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    updateUI();
  });

  window.FloristaCart = {
    CATALOG: CATALOG,
    get: getCart,
    add: addProduct,
    clear: clearCart,
    refresh: updateUI,
    total: function () {
      return cartTotal(getCart());
    },
    formatPrice: function (n) {
      return formatRub(n);
    },
    lineTotal: function (line) {
      return lineSum(line);
    },
  };
})();
