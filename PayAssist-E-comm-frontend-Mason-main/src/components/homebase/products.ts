import type { Product } from "./types";

// MASON catalog — 7 frontend collections, ~10 SKUs each, all frontend-only
// (no backend seed yet). Pricing rules: min ~$30, max $300; Storage strictly
// $25–$40. No furniture, no appliances, no luxury, no famous brands.
//
// Collections (display label → `cat` value here → URL key):
//   Objects & Decor    → "Decor"       → /shop?category=decor
//   Sculptural Light   → "Lighting"    → /shop?category=lighting
//   Kitchen            → "Kitchen"     → /shop?category=kitchen
//   The Tablescape     → "Tablescape"  → /shop?category=tablescape
//   The Shelf, Styled  → "Shelf"       → /shop?category=shelf
//   Storage            → "Storage"     → /shop?category=storage
//   Bedroom            → "Bedroom"     → /shop?category=bedroom
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  // OBJECTS & DECOR
  { id: "d1",  name: "Hand-thrown Ceramic Vessel", cat: "Decor",      price: 98,  badge: "Best seller", img: u("photo-1631125915902-d8abe9225ff2"), desc: "A small-batch ceramic vessel, hand-thrown and glazed in the studio. Quietly sculptural on its own." },
  { id: "d2",  name: "Minimal Decor Objects",      cat: "Decor",      price: 95,                       img: u("photo-1597696929736-6d13bed8e6a8"), desc: "A set of restrained sculptural objects to layer on a console, shelf or mantel." },
  { id: "d3",  name: "Carved Stone Bowl",          cat: "Decor",      price: 110,                      img: u("photo-1612196808214-b8e1d6145a8c"), desc: "A solid carved-stone bowl — heavy in the hand, quiet on the table." },
  { id: "d4",  name: "Soft Neutral Tray Object",   cat: "Decor",      price: 75,                       img: u("photo-1660721671073-e139688fa3cf"), desc: "Soft neutrals and natural materials, made to layer beautifully on any surface." },
  { id: "d5",  name: "Matte Stoneware Sculpture",  cat: "Decor",      price: 165,                      img: u("photo-1677761640321-b80251be00ca"), desc: "A modern sculptural piece in matte stoneware, finished by hand." },
  { id: "d6",  name: "Candle & Small Vase Set",    cat: "Decor",      price: 88,                       img: u("photo-1643569556871-91ec60671ed7"), desc: "A curated pairing — a hand-poured candle and a small vase, made to live together." },
  { id: "d7",  name: "Oak Sculptural Form",        cat: "Decor",      price: 85,                       img: u("photo-1526198049595-f32cde2a219d"), desc: "Solid oak, sanded smooth and finished with a natural oil. A simple, sculptural accent." },
  { id: "d8",  name: "Trio of Shelf Objects",      cat: "Decor",      price: 105,                      img: u("photo-1687191883721-257d8cad5b54"), desc: "Three small objects, sized and weighted for thoughtful shelf styling." },
  { id: "d9",  name: "Travertine Decor Object",    cat: "Decor",      price: 145,                      img: u("photo-1633000116322-d7f5cb7d3ebb"), desc: "A statement object in honed travertine and patinated brass." },
  { id: "d10", name: "Ceramic Vase + Bowl Pair",   cat: "Decor",      price: 125, badge: "New",        img: u("photo-1631125915732-b98f8774f675"), desc: "A coordinated ceramic pair in earth tones — vase and small vessel." },

  // SCULPTURAL LIGHT
  { id: "l11", name: "Brass + Opal Pendant",       cat: "Lighting",   price: 195, badge: "Best seller", img: u("photo-1565814329452-e1efa11c5b89"), desc: "A spun-brass pendant with an opal glass diffuser, casting a soft and even glow." },
  { id: "l12", name: "Alabaster Table Lamp",       cat: "Lighting",   price: 245,                      img: u("photo-1540932239986-30128078f3c5"), desc: "A turned alabaster base with a linen shade. Warm dimmable LED included." },
  { id: "l13", name: "Slim Brass Wall Light",      cat: "Lighting",   price: 75,                       img: u("photo-1656402887556-e727ffe1f6d7"), desc: "A slim brass wall light that sweeps a soft pool of light onto the bedside." },
  { id: "l14", name: "Arched Stem Reading Lamp",   cat: "Lighting",   price: 145,                      img: u("photo-1656403002413-2ac6137237d6"), desc: "A simple arched-stem reading lamp in powder-coated steel." },
  { id: "l15", name: "Linen Shade Bedside Lamp",   cat: "Lighting",   price: 115,                      img: u("photo-1568146687696-427782f92379"), desc: "A discreet bedside light with a linen shade — low, warm, even." },
  { id: "l16", name: "Smoked Glass Pendant",       cat: "Lighting",   price: 165,                      img: u("photo-1669994536947-4e3bbc7eca6a"), desc: "A handblown smoked-glass pendant with a slim cord — no two alike." },
  { id: "l17", name: "Pleated Cotton Shade Lamp",  cat: "Lighting",   price: 95,                       img: u("photo-1648809895588-c0bd7e06a61c"), desc: "A small lamp with a pleated cotton shade — diffused, even light." },
  { id: "l18", name: "Honey Onyx Table Lamp",      cat: "Lighting",   price: 285, badge: "New",        img: u("photo-1589173956121-8891103b66b0"), desc: "A signature studio lamp in honey onyx, hand-finished and unrepeated." },
  { id: "l19", name: "Handblown Pendant",          cat: "Lighting",   price: 130,                      img: u("photo-1674849665344-944d468883d0"), desc: "A handblown clear-glass pendant with a slim brass cord." },
  { id: "l20", name: "Small Corner Glow Lamp",     cat: "Lighting",   price: 55,                       img: u("photo-1641295432458-0f8ed522972e"), desc: "A small table lamp made to glow warm, low and quiet from a corner shelf." },

  // KITCHEN — small useful items, no appliances. Images are real product hero
  // shots downloaded from IKEA's CDN (1400x1400 clean white-background) and
  // saved under public/products/kitchen/. k27 falls back to Unsplash (IKEA's
  // mixing bowls are stainless/plastic, not ceramic).
  { id: "k21", name: "Glass Storage Jar",          cat: "Kitchen",    price: 38,                       img: "/products/kitchen/k21-glass-storage-jar.jpg",      desc: "A handblown glass storage jar with a cork stopper — for flour, oats or salt on the counter." },
  { id: "k22", name: "Ceramic Canister",           cat: "Kitchen",    price: 52,                       img: "/products/kitchen/k22-ceramic-canister.jpg",       desc: "A hand-glazed ceramic canister with a wooden lid — a quiet keeper for the everyday." },
  { id: "k23", name: "Wooden Cutting Board",       cat: "Kitchen",    price: 78,                       img: "/products/kitchen/k23-wooden-cutting-board.jpg",   desc: "Solid walnut, oiled and waxed. Built to take a knife for decades." },
  { id: "k24", name: "Kitchen Brush",              cat: "Kitchen",    price: 32,                       img: "/products/kitchen/k24-kitchen-brush.jpg",          desc: "A natural-bristle dish brush with a beechwood handle. Replaceable head." },
  { id: "k25", name: "Linen Kitchen Towels",       cat: "Kitchen",    price: 38,                       img: "/products/kitchen/k25-linen-kitchen-towels.jpg",   desc: "A pair of softly woven linen kitchen towels — washed soft, made to last." },
  { id: "k26", name: "Olive Oil Bottle",           cat: "Kitchen",    price: 45,                       img: "/products/kitchen/k26-olive-oil-bottle.jpg",       desc: "A handblown glass olive-oil bottle with a slow pour spout — beautiful on the counter." },
  { id: "k27", name: "Ceramic Mixing Bowl",        cat: "Kitchen",    price: 58, badge: "Best seller", img: "/products/kitchen/k27-ceramic-mixing-bowl.jpg",    desc: "A wide reactive-glaze stoneware mixing bowl — for morning batter, evening dough." },
  { id: "k28", name: "Wooden Utensil Holder",      cat: "Kitchen",    price: 62,                       img: "/products/kitchen/k28-wooden-utensil-holder.jpg",  desc: "A turned wooden crock for spatulas and wooden spoons — quiet on the counter." },
  { id: "k29", name: "Salt & Pepper Grinder Set",  cat: "Kitchen",    price: 54,                       img: "/products/kitchen/k29-salt-pepper-grinder-set.jpg",desc: "A pair of hand-turned wooden grinders with ceramic mechanisms — a working classic." },
  { id: "k30", name: "Small Serving Tray",         cat: "Kitchen",    price: 48,                       img: "/products/kitchen/k30-small-serving-tray.jpg",     desc: "A small wooden serving tray with sanded edges — for morning coffee or evening cheese." },
  { id: "k31", name: "Glass Carafe",               cat: "Kitchen",    price: 42, badge: "New",         img: "/products/kitchen/k31-glass-carafe.jpg",           desc: "A handblown glass carafe with a smooth pour — for water, juice or wine on the table." },
  { id: "k32", name: "Dish Drying Rack",           cat: "Kitchen",    price: 68,                       img: "/products/kitchen/k32-dish-drying-rack.jpg",       desc: "A simple wooden dish drying rack with a slatted base — quiet beside the sink." },

  // THE TABLESCAPE — affordable table products. Hero images sourced from
  // everythingkitchens.com product pages (single-source per user direction)
  // and saved under public/products/tablescape/.
  { id: "t31", name: "Dinner Plate",               cat: "Tablescape", price: 24,                       img: "/products/tablescape/t31-dinner-plate.jpg",     desc: "A stoneware dinner plate in soft linen — every piece subtly different by hand." },
  { id: "t32", name: "Pasta Bowl",                 cat: "Tablescape", price: 32,                       img: "/products/tablescape/t32-pasta-bowl.jpg",       desc: "A wide-rim pasta bowl — for ramen, salads and slow Sunday dinners." },
  { id: "t33", name: "Stoneware Mug",              cat: "Tablescape", price: 18,                       img: "/products/tablescape/t33-stoneware-mug.jpg",    desc: "A 14oz stoneware mug with a satisfying weight — for the morning ritual." },
  { id: "t34", name: "Wine Glass",                 cat: "Tablescape", price: 14, badge: "Best seller", img: "/products/tablescape/t34-wine-glass.jpg",       desc: "A stemless wine glass in clear crystalline glass — a quiet everyday classic." },
  { id: "t35", name: "Linen Napkins",              cat: "Tablescape", price: 48,                       img: "/products/tablescape/t35-linen-napkins.jpg",    desc: "A set of softly woven oatmeal napkins, generously sized and made to soften over time." },
  { id: "t36", name: "Table Runner",               cat: "Tablescape", price: 68,                       img: "/products/tablescape/t36-table-runner.jpg",     desc: "A long woven cotton table runner — the quiet finish to any considered table." },
  { id: "t37", name: "Serving Tray",               cat: "Tablescape", price: 95,                       img: "/products/tablescape/t37-serving-tray.jpg",     desc: "A bamboo serving tray — for morning coffee, evening cheese, or whatever the day calls for." },
  { id: "t38", name: "Serving Bowl",               cat: "Tablescape", price: 58,                       img: "/products/tablescape/t38-serving-bowl.jpg",     desc: "A wide 5-quart white serving bowl — for salad, pasta or the whole roast chicken." },
  { id: "t39", name: "Glass Carafe",               cat: "Tablescape", price: 42,                       img: "/products/tablescape/t39-glass-carafe.jpg",     desc: "A clear glass carafe for water or wine — pourable, beautiful, made to live on the table." },
  { id: "t40", name: "Salt & Pepper Mill",         cat: "Tablescape", price: 68,                       img: "/products/tablescape/t40-salt-pepper-mill.jpg", desc: "A pair of hand-grip mills with ceramic mechanisms — the quiet working pair on the counter." },
  { id: "t41", name: "Cake Stand",                 cat: "Tablescape", price: 145,                      img: "/products/tablescape/t41-cake-stand.jpg",       desc: "A footed white porcelain cake stand — for Sunday baking, birthdays, and the slow morning slice." },
  { id: "t42", name: "Cheese Board",               cat: "Tablescape", price: 185, badge: "New",        img: "/products/tablescape/t42-cheese-board.jpg",     desc: "A solid beech cheese board, sanded soft — for a board of cheese, fruit, or charcuterie." },

  // THE SHELF, STYLED — small things on a shelf. Hero images sourced from
  // food52.com/shop product pages (single-source per user direction) and saved
  // under public/products/shelf/. (sh47 picture frame skipped — food52 doesn't
  // carry standalone picture frames; 11 products in this collection.)
  { id: "sh41", name: "Ceramic Bud Vase",          cat: "Shelf",      price: 42,                       img: "/products/shelf/sh41-ceramic-bud-vase.jpg",   desc: "A hand-thrown ceramic bud vase in a bronze-look glaze — for a single stem on the open shelf." },
  { id: "sh42", name: "Marbled Ceramic Vase",      cat: "Shelf",      price: 85,                       img: "/products/shelf/sh42-ceramic-vase.jpg",       desc: "A hand-thrown marbled bottleneck vase — sculptural enough to stand on its own." },
  { id: "sh43", name: "Maple Wood Bookends",       cat: "Shelf",      price: 125,                      img: "/products/shelf/sh43-brass-bookends.jpg",    desc: "A pair of hand-turned arched maple-wood bookends — weighty, sculptural and quiet." },
  { id: "sh45", name: "Brass Candle Holder",       cat: "Shelf",      price: 68,                       img: "/products/shelf/sh45-candle-holder.jpg",     desc: "A solid brass candle holder in a slim sculptural silhouette — light it once and you'll keep it lit." },
  { id: "sh46", name: "Stoneware Bowl Pair",       cat: "Shelf",      price: 78,                       img: "/products/shelf/sh46-decorative-bowl.jpg",   desc: "A pair of small hand-made stoneware bowls in soft alabaster and sundrop — for the open shelf, the bedside, the bath." },
  { id: "sh48", name: "Sculptural Footed Vase",    cat: "Shelf",      price: 145,                      img: "/products/shelf/sh48-small-sculpture.jpg",   desc: "A footed ceramic vase with a marbled hand-poured glaze — shelf-scale sculpture, hand-finished." },
  { id: "sh49", name: "Walnut Wood Bowl",          cat: "Shelf",      price: 95,                       img: "/products/shelf/sh49-wooden-object.jpg",     desc: "A solid walnut bowl, hand-carved and oil-finished — sculptural and sized for the open shelf." },
  { id: "sh50", name: "Amber Glass Vessel",        cat: "Shelf",      price: 58,                       img: "/products/shelf/sh50-glass-vessel.jpg",      desc: "A small mouthblown glass vessel in soft amber — light catches it differently every hour." },
  { id: "sh52", name: "Stoneware Oval Tray",       cat: "Shelf",      price: 42, badge: "New",         img: "/products/shelf/sh52-small-tray.jpg",        desc: "A small oval stoneware tray — for a candle, a vase, and the small things that make a shelf feel composed." },

  // STORAGE — strict $25–$40 only, small storage products. Hero images
  // sourced from cb2.com product pages (single-source per user direction) via
  // their scene7 CDN and saved under public/products/storage/.
  { id: "s51", name: "Seagrass Storage Basket",    cat: "Storage",    price: 38, badge: "Best seller", img: "/products/storage/s51-woven-basket.jpg",      desc: "A hand-woven seagrass basket with a natural finish — bedside, bath, or by the door." },
  { id: "s52", name: "Shagreen Storage Box",       cat: "Storage",    price: 36,                       img: "/products/storage/s52-storage-box.jpg",       desc: "A small lidded box in soft ivory shagreen — for jewellery, papers, or the everyday small things." },
  { id: "s53", name: "Rattan Storage Basket",      cat: "Storage",    price: 38,                       img: "/products/storage/s53-wicker-bin.jpg",        desc: "A hand-woven brown rattan basket — for cords, toys or a quiet pile of magazines." },
  { id: "s54", name: "Marble Catchall Tray",       cat: "Storage",    price: 32,                       img: "/products/storage/s54-catchall-tray.jpg",     desc: "A small carved brown-marble catchall — for keys, change and the everyday in-and-out." },
  { id: "s55", name: "Cotton Rope Basket",         cat: "Storage",    price: 34,                       img: "/products/storage/s55-rope-basket.jpg",       desc: "A round cotton-rope basket in soft black — for blankets, laundry or a calm corner." },
  { id: "s56", name: "Natural Storage Box",        cat: "Storage",    price: 30,                       img: "/products/storage/s56-felt-bin.jpg",          desc: "A natural seagrass storage box — quiet under a desk, on a shelf, or in a closet." },
  { id: "s57", name: "Clear Drawer Organizer",     cat: "Storage",    price: 28,                       img: "/products/storage/s57-drawer-organizer.jpg",  desc: "A clear acrylic organiser with compartments — for jewellery, watches and the small everyday." },
  { id: "s58", name: "Brass-handled Storage Box",  cat: "Storage",    price: 40,                       img: "/products/storage/s58-storage-crate.jpg",     desc: "A natural-seagrass box with unlacquered brass handles — built for the shelf, the closet, the long haul." },
  { id: "s59", name: "White Marble Box",           cat: "Storage",    price: 38,                       img: "/products/storage/s59-decorative-box.jpg",    desc: "A small white-marble box with a polished finish — for rings, the bedside, the writing desk." },
  { id: "s60", name: "Leather Caddy",              cat: "Storage",    price: 36, badge: "New",         img: "/products/storage/s60-storage-caddy.jpg",     desc: "A small leather caddy with a top handle — for the bath shelf, the bedside, or a quiet evening tray." },

  // BEDROOM — small textiles + accessories, no furniture. Hero images sourced
  // from ikea.com US bedroom category (single-source per user direction) and
  // saved under public/products/bedroom/.
  { id: "b61", name: "Linen Pillow Cover",         cat: "Bedroom",    price: 14,                       img: "/products/bedroom/b61-pillow-cover.jpg",       desc: "A softly washed off-white pillow cover in a generous 26x26\" Euro size — the quiet finish on any bed." },
  { id: "b62", name: "Soft Throw Blanket",         cat: "Bedroom",    price: 68, badge: "Best seller", img: "/products/bedroom/b62-throw-blanket.jpg",      desc: "A finely woven cotton throw in soft green — sized to fold at the foot of the bed." },
  { id: "b63", name: "Cotton Sheet Set",           cat: "Bedroom",    price: 58,                       img: "/products/bedroom/b63-sheet-set.jpg",          desc: "Long-staple cotton sheets with a soft hand and quiet drape — sized for a full bed." },
  { id: "b64", name: "Linen Duvet Cover",          cat: "Bedroom",    price: 98,                       img: "/products/bedroom/b64-duvet-cover.jpg",        desc: "A softly washed duvet cover and pillowcases in light beige — drapes beautifully, softens over time." },
  { id: "b65", name: "Knit Decorative Cushion",    cat: "Bedroom",    price: 24,                       img: "/products/bedroom/b65-decorative-cushion.jpg", desc: "A 18x18\" knit-look cushion in soft gray and white — the small finishing touch on a calm bed." },
  { id: "b67", name: "Jute Laundry Basket",        cat: "Bedroom",    price: 48,                       img: "/products/bedroom/b67-laundry-basket.jpg",     desc: "A soft-sided jute and cotton laundry basket with carry handles — the calm corner of the bedroom." },
  { id: "b68", name: "Brass Bedside Lamp",         cat: "Bedroom",    price: 58,                       img: "/products/bedroom/b68-bedside-lamp.jpg",       desc: "A slim brass and white bedside lamp with a fabric shade — warm, even light at the bedside." },
  { id: "b69", name: "Bedside Alarm Clock",        cat: "Bedroom",    price: 14,                       img: "/products/bedroom/b69-alarm-clock.jpg",        desc: "A simple white bedside alarm clock with a soft analogue face — the quiet way to start a morning." },
];

export const defaultCart = [
  { uid: "c1", id: "l11", name: "Brass + Opal Pendant",       finish: "Brass · Opal Glass", price: 195, qty: 1, img: u("photo-1565814329452-e1efa11c5b89") },
  { uid: "c2", id: "b61", name: "Linen Pillow Cover", finish: "Off-white",                 price: 14,  qty: 1, img: "/products/bedroom/b61-pillow-cover.jpg" },
];
