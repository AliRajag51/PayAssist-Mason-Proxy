/**
 * SONA — storefront smoke test.
 *
 * Verifies the storefront is correctly wired to the backend: catalog pages
 * render real data, the category filter works, the PDP shows backend `itemInfo`
 * content, and a guest order can be placed and read back.
 *
 * Requires the full stack running (storefront + backend + seeded DB). See
 * the local dev recipe in `.claude/STOREFRONT-PLAYBOOK.md`.
 *
 * Usage (storefront on :3000 by default):
 *   npm run smoke
 *   BASE_URL=http://localhost:3000 npm run smoke
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
let failures = 0;

// React SSR injects <!-- --> between adjacent text nodes; strip before matching.
const strip = (s) => s.replace(/<!-- -->/g, "");

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, body: strip(await res.text()) };
}

function check(name, cond, detail = "") {
  if (cond) console.log(`  ✓ ${name}`);
  else {
    console.error(`  ✗ ${name} ${detail}`);
    failures++;
  }
}

async function run() {
  console.log(`SONA smoke → ${BASE}\n`);

  const home = await get("/");
  check("home 200", home.status === 200, `(got ${home.status})`);
  const cards = (home.body.match(/class="pcard"/g) || []).length;
  check("home shows product cards", cards > 0, `(found ${cards})`);

  const shop = await get("/shop");
  check("shop 200", shop.status === 200, `(got ${shop.status})`);

  const earbuds = await get("/shop?cat=Earbuds");
  const slugs = [
    ...earbuds.body.matchAll(/pcard__name" href="\/product-details\/([a-z]+)"/g),
  ].map((m) => m[1]);
  check(
    "category filter returns only earbuds",
    slugs.length > 0 && slugs.every((s) => ["air", "mini"].includes(s)),
    `(got ${slugs.join(",") || "none"})`
  );

  const pdp = await get("/product-details/one");
  check("PDP 200", pdp.status === 200, `(got ${pdp.status})`);
  check("PDP renders backend itemInfo (spec)", pdp.body.includes("40 mm titanium"));
  check("PDP renders price", pdp.body.includes("$449"));

  const payload = {
    cart: [
      { id: "one", title: "Sona One", image: "x", parent: "Headphones", price: 449, originalPrice: 449, discount: 0, orderQuantity: 1 },
    ],
    name: "Smoke Test", email: "smoke@example.com", contact: "1",
    address: "1 Test St", city: "Berlin", country: "Germany", zipCode: "10119",
    subTotal: 449, shippingCost: 0, discount: 0, totalAmount: 449,
    paymentMethod: "Card", status: "pending",
  };
  const orderRes = await fetch(`${BASE}/api/order/addOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const orderData = await orderRes.json().catch(() => ({}));
  const order = orderData.order;
  check("guest order placed", orderRes.ok && !!order?._id, `(status ${orderRes.status})`);

  if (order?._id) {
    const op = await get(`/order/${order._id}`);
    check("order page 200", op.status === 200, `(got ${op.status})`);
    check("order page shows invoice", op.body.includes(`SONA-${order.invoice}`));
  }

  // coupons available (seeded sample)
  const couponsRes = await fetch(`${BASE}/api/coupon`);
  const coupons = await couponsRes.json().catch(() => []);
  check(
    "coupons endpoint returns the seeded SONA10",
    Array.isArray(coupons) && coupons.some((c) => c.couponCode === "SONA10")
  );

  // guest order lookup by invoice + email (the order-tracking mechanism)
  if (order?._id) {
    const ordersRes = await fetch(`${BASE}/api/order/orders`);
    const ordersData = await ordersRes.json().catch(() => ({}));
    const list = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
    const found = list.find(
      (o) =>
        Number(o.invoice) === Number(order.invoice) &&
        String(o.email || "").toLowerCase() === "smoke@example.com"
    );
    check("order lookup by invoice + email works", !!found);
  }

  // auth: the seeded demo user can sign in
  const loginRes = await fetch(`${BASE}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@sona.test", password: "demo1234" }),
  });
  const loginData = await loginRes.json().catch(() => ({}));
  check("demo user can sign in (token returned)", loginRes.ok && !!loginData?.data?.token);

  console.log(
    failures ? `\nFAILED: ${failures} check(s)` : "\nAll smoke checks passed."
  );
  process.exit(failures ? 1 : 0);
}

run().catch((e) => {
  console.error("smoke crashed:", e);
  process.exit(1);
});
