/**
 * Tìm kiếm sản phẩm — dùng chung cho search.html (Firestore toàn cửa hàng).
 */
export const CATEGORY_META = {
  phone: {
    label: "Điện thoại",
    href: "list.html",
    icon: "📱",
  },
  tablet: {
    label: "Máy tính bảng",
    href: "list-tablet.html",
    icon: "📟",
  },
  headphone: {
    label: "Tai nghe",
    href: "list-tai-nghe.html",
    icon: "🎧",
  },
  watch: {
    label: "Đồng hồ",
    href: "list-dong-ho.html",
    icon: "⌚",
  },
  accessory: {
    label: "Phụ kiện",
    href: "list-phu-kien.html",
    icon: "🔌",
  },
};

const BRAND_EXTRA = {
  iphone: "apple iphone",
  samsung: "samsung galaxy",
  oppo: "oppo",
  xiaomi: "xiaomi",
  vivo: "vivo",
  other: "",
};

export function getCategoryMeta(p) {
  const c = (p.category || "").trim();
  if (!c) return CATEGORY_META.phone;
  return CATEGORY_META[c] || { label: "Sản phẩm", href: "index.html", icon: "📦" };
}

export function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function productSearchBlob(p) {
  const meta = getCategoryMeta(p);
  const brand = (p.brand || "").toLowerCase();
  const brandX = BRAND_EXTRA[brand] || brand;
  return normalizeText(
    [
      p.name,
      meta.label,
      p.category,
      brand,
      brandX,
      p.ram,
      p.screen,
      p.storage,
      p.smember,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function filterProductsByQuery(products, query) {
  const q = normalizeText(query);
  if (!q) return products.slice();
  return products.filter((p) => productSearchBlob(p).includes(q));
}

export function fmtPrice(n) {
  return n ? Number(n).toLocaleString("vi-VN") + "đ" : "";
}

export function discPct(price, old) {
  return !old || !price || old <= price
    ? 0
    : Math.round((1 - price / old) * 100);
}
