export type Category = { slug: string; name: string; emoji: string; description: string; parentSlug?: string };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
  image: string;
  stock: number;
};

export const categories: Category[] = [
  { slug: "poultry-buy-sell", name: "Buy & Sell Poultry", emoji: "🐓", description: "Connect with poultry listings and find the birds your farm needs." },
  { slug: "hatching-eggs", name: "Hatching Eggs", emoji: "🥚", description: "Explore hatching egg batches, quantities and supplier details." },
  { slug: "layer-birds", name: "Layer Birds", emoji: "🐔", description: "Find layer birds for your operation, with listing details to review." },
  { slug: "buying-birds", name: "Buying Birds", emoji: "🪶", description: "Browse bird sourcing listings and connect with poultry suppliers." },
  { slug: "chicken-sale", name: "Chicken Sale", emoji: "🍗", description: "Explore poultry meat listings with product and availability details." },
  { slug: "chick-sale", name: "Chick Sale", emoji: "🐣", description: "Find chick listings and review batch and supplier information.", parentSlug: "poultry-buy-sell" },
  { slug: "rabbit", name: "Rabbit", emoji: "🐇", description: "Browse rabbit listings and connect with suppliers.", parentSlug: "poultry-buy-sell" },
  { slug: "breeding-rabbits", name: "Breeding Rabbits", emoji: "🐇", description: "Find breeding rabbits and review breed and health details.", parentSlug: "rabbit" },
  { slug: "pet-rabbits", name: "Pet Rabbits", emoji: "🐰", description: "Explore rabbits offered as pets.", parentSlug: "rabbit" },
];

export const topLevelCategories = categories.filter((category) => !category.parentSlug);
export const shopCategories = [
  ...topLevelCategories,
  ...categories.filter((category) => category.slug === "breeding-rabbits" || category.slug === "pet-rabbits"),
];

export function getCategoryAndDescendantSlugs(categorySlug: string): Set<string> {
  const slugs = new Set([categorySlug]);
  let addedCategory = true;

  while (addedCategory) {
    addedCategory = false;
    for (const category of categories) {
      if (category.parentSlug && slugs.has(category.parentSlug) && !slugs.has(category.slug)) {
        slugs.add(category.slug);
        addedCategory = true;
      }
    }
  }

  return slugs;
}

export const products: Product[] = [
  { id: "sample-hatching-eggs", slug: "hatching-eggs-listing", name: "Hatching Eggs - Sample Listing", category: "hatching-eggs", price: 399, mrp: 449, unit: "Pack of 6", description: "Example marketplace listing. Confirm breed, fertility, batch details, handling and availability directly with the supplier before purchase.", image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=85", stock: 12 },
  { id: "sample-layer-birds", slug: "layer-birds-listing", name: "Layer Birds - Sample Listing", category: "layer-birds", price: 650, mrp: 720, unit: "Per bird", description: "Example marketplace listing. Verify breed, age, health records, quantity and transport arrangements with the seller.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 8 },
  { id: "sample-day-old-chicks", slug: "day-old-chicks-listing", name: "Day-Old Chicks - Sample Listing", category: "chick-sale", price: 75, mrp: 90, unit: "Per chick", description: "Example marketplace listing. Confirm breed, hatch date, vaccination information, minimum order and delivery conditions with the supplier.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 50 },
  { id: "sample-live-poultry", slug: "live-poultry-listing", name: "Live Poultry - Sample Listing", category: "poultry-buy-sell", price: 900, mrp: 1000, unit: "Per bird", description: "Example marketplace listing. Confirm bird type, quantity, health information, seller identity and transport before arranging a transaction.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 10 },
  { id: "sample-bird-sourcing", slug: "poultry-sourcing-listing", name: "Poultry Bird Sourcing - Sample Listing", category: "buying-birds", price: 850, mrp: 950, unit: "Per bird", description: "Example sourcing listing. Contact the supplier to confirm the bird type, quantity, price, health records and fulfilment terms.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 15 },
  { id: "sample-chicken-sale", slug: "chicken-sale-listing", name: "Chicken Sale - Sample Listing", category: "chicken-sale", price: 220, mrp: 250, unit: "Per kg", description: "Example marketplace listing. Confirm product condition, weight, sourcing, handling, storage and delivery details with the seller.", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85", stock: 20 },
  { id: "p10", slug: "fertile-hatching-eggs-batch", name: "Fertile Hatching Eggs - Sample Batch", category: "hatching-eggs", price: 620, mrp: 700, unit: "Pack of 12", description: "Illustrative listing. Ask the seller to confirm breed, collection date, fertility information, packing and availability.", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85", stock: 9 },
  { id: "p11", slug: "mixed-breed-hatching-eggs", name: "Mixed Breed Hatching Eggs - Sample", category: "hatching-eggs", price: 980, mrp: 1100, unit: "Pack of 20", description: "Illustrative listing. Confirm the breed mix, batch details, handling instructions and delivery conditions with the supplier.", image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=85", stock: 6 },
  { id: "p12", slug: "point-of-lay-birds", name: "Point-of-Lay Birds - Sample Listing", category: "layer-birds", price: 1150, mrp: 1280, unit: "Per bird", description: "Illustrative listing. Verify age, breed, health records, laying status and transport suitability directly with the seller.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 18 },
  { id: "p13", slug: "young-layer-pullets", name: "Young Layer Pullets - Sample Lot", category: "layer-birds", price: 890, mrp: 990, unit: "Per bird", description: "Illustrative listing. Contact the seller to confirm age, breed, vaccination records, quantity and fulfilment arrangements.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 24 },
  { id: "p14", slug: "farm-raised-poultry-lot", name: "Farm-Raised Poultry - Sample Lot", category: "poultry-buy-sell", price: 4200, mrp: 4600, unit: "Lot of 5 birds", description: "Illustrative marketplace lot. Verify bird details, total quantity, health records, pricing and transport with the seller.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 5 },
  { id: "p15", slug: "backyard-poultry-pair", name: "Backyard Poultry Pair - Sample", category: "poultry-buy-sell", price: 1800, mrp: 2000, unit: "Pair", description: "Illustrative listing only. Ask the seller to confirm bird type, age, health, pair details and collection arrangements.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 7 },
  { id: "p16", slug: "poultry-bird-buyer-request", name: "Poultry Bird Sourcing Request", category: "buying-birds", price: 720, mrp: 800, unit: "Per bird · indicative", description: "Example buyer sourcing post. Confirm requirements, seller availability, final price and terms before any transaction.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 12 },
  { id: "p17", slug: "farm-bird-sourcing-lot", name: "Farm Bird Sourcing Lot - Sample", category: "buying-birds", price: 3600, mrp: 4000, unit: "Lot of 5 birds", description: "Illustrative sourcing listing. Confirm bird type, quantity, health documentation, location and transport with the supplier.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 4 },
  { id: "p18", slug: "fresh-chicken-market-listing", name: "Fresh Chicken - Sample Listing", category: "chicken-sale", price: 285, mrp: 320, unit: "Per kg · indicative", description: "Illustrative listing only. Confirm cut, weight, handling, storage, sourcing, local requirements and delivery with the seller.", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85", stock: 16 },
  { id: "p19", slug: "whole-chicken-sale-listing", name: "Whole Chicken - Sample Listing", category: "chicken-sale", price: 340, mrp: 380, unit: "Per bird · indicative", description: "Illustrative listing. Confirm product condition, actual weight, processing details, storage and delivery arrangements.", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85", stock: 11 },
  { id: "p20", slug: "day-old-layer-chicks", name: "Day-Old Layer Chicks - Sample", category: "chick-sale", price: 92, mrp: 105, unit: "Per chick", description: "Illustrative listing. Confirm breed, hatch date, vaccination details, minimum quantity and delivery conditions with the supplier.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 80 },
  { id: "p21", slug: "week-old-chicks-lot", name: "Week-Old Chicks - Sample Lot", category: "chick-sale", price: 125, mrp: 145, unit: "Per chick", description: "Illustrative listing. Ask the seller to confirm age, breed, health records, batch size and suitable transport conditions.", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", stock: 60 },
  { id: "sample-breeding-rabbit", slug: "breeding-rabbit-listing", name: "Breeding Rabbits - Sample Listing", category: "breeding-rabbits", price: 1800, mrp: 2000, unit: "Per rabbit", description: "Illustrative listing. Confirm breed, age, health records, breeding history and collection or transport arrangements with the seller.", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=85", stock: 6 },
  { id: "sample-pet-rabbit", slug: "pet-rabbit-listing", name: "Pet Rabbits - Sample Listing", category: "pet-rabbits", price: 1200, mrp: 1400, unit: "Per rabbit", description: "Illustrative listing. Confirm breed, age, health and care information, and suitable collection arrangements directly with the seller.", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=85", stock: 4 },
];

export const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const CATALOG_STORAGE_KEY = "p1-catalog-products-v2";
const LEGACY_CATALOG_STORAGE_KEY = "p1-catalog-products";
const categorySlugs = new Set(categories.map((category) => category.slug));

function isMarketplaceProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;
  return typeof product.id === "string"
    && typeof product.slug === "string"
    && typeof product.name === "string"
    && typeof product.category === "string"
    && categorySlugs.has(product.category)
    && typeof product.price === "number"
    && Number.isFinite(product.price)
    && typeof product.mrp === "number"
    && Number.isFinite(product.mrp)
    && typeof product.unit === "string"
    && typeof product.description === "string"
    && typeof product.image === "string"
    && typeof product.stock === "number"
    && Number.isFinite(product.stock);
}

function filterMarketplaceProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) return [];

  const usedSlugs = new Set<string>();
  return value.filter(isMarketplaceProduct).map((product) => {
    const baseSlug = product.slug.toLowerCase();
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    usedSlugs.add(slug);
    return slug === product.slug ? product : { ...product, slug };
  });
}

export function getCatalogProducts(): Product[] {
  if (typeof window === "undefined") return products;

  try {
    const stored = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (stored !== null) return filterMarketplaceProducts(JSON.parse(stored));

    const legacy = window.localStorage.getItem(LEGACY_CATALOG_STORAGE_KEY);
    if (!legacy) return products;
    const legacyExtras = filterMarketplaceProducts(JSON.parse(legacy)).filter(
      (product) => /-[0-9]{6}$/.test(product.id) && !products.some((seed) => seed.slug === product.slug),
    );
    const migratedProducts = [...products, ...legacyExtras];
    saveCatalogProducts(migratedProducts);
    return migratedProducts;
  } catch {
    return products;
  }
}

export function saveCatalogProducts(nextProducts: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(filterMarketplaceProducts(nextProducts)));
}

export function createProductId(value: string) {
  return `${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product"}-${Date.now().toString().slice(-6)}`;
}
