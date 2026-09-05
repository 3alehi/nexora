/**
 * Seeds the database with fake collections + NFTs for local dev/testing.
 * Run with: npx tsx scripts/seed.ts
 *
 * Creates one seed auth user + profile (if not already present), then
 * inserts a batch of collections and 400-500 NFTs distributed across them.
 */
import "dotenv/config";
import { supabaseAdmin } from "../src/integrations/supabase/client.js";

const SEED_EMAIL = "seed-bot@nexora.local";
const SEED_USERNAME = "nexora_seed";

const CHAINS = ["sepolia", "mainnet", "polygon", "base", "arbitrum"];
const STANDARDS = ["ERC721", "ERC1155"] as const;
const STATUSES = ["draft", "minted", "listed", "sold"] as const;

const ADJECTIVES = [
  "Cosmic", "Neon", "Shadow", "Crystal", "Golden", "Cyber", "Mystic", "Frozen",
  "Ancient", "Radiant", "Void", "Solar", "Lunar", "Feral", "Astral", "Chrome",
  "Velvet", "Toxic", "Sacred", "Rogue", "Ethereal", "Glitch", "Obsidian", "Prismatic",
];

const NOUNS = [
  "Ape", "Wolf", "Samurai", "Robot", "Dragon", "Phoenix", "Ghost", "Warrior",
  "Punk", "Wizard", "Serpent", "Golem", "Ranger", "Reaper", "Knight", "Nomad",
  "Cat", "Owl", "Panther", "Titan", "Sprite", "Rider", "Oracle", "Hunter",
];

const COLLECTION_THEMES = [
  "Punks", "Apes", "Cats", "Dragons", "Robots", "Legends", "Realms", "Voyagers",
  "Ghosts", "Titans", "Wizards", "Outlaws", "Spirits", "Knights", "Nomads", "Oracles",
  "Reapers", "Sprites", "Hunters", "Riders", "Golems", "Rangers", "Serpents", "Phoenixes",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPrice(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(4));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureSeedProfile(): Promise<string> {
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username_normalized", SEED_USERNAME.toLowerCase())
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existing) return existing.id;

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: SEED_EMAIL,
    email_confirm: true,
    password: crypto.randomUUID(),
  });

  if (createError) throw createError;
  const userId = created.user.id;

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    username: SEED_USERNAME,
    username_normalized: SEED_USERNAME.toLowerCase(),
    email: SEED_EMAIL,
    display_name: "Nexora Seed Bot",
  });

  if (profileError) throw profileError;
  return userId;
}

async function seedCollections(creatorId: string) {
  const collections = COLLECTION_THEMES.map((theme, i) => {
    const name = `${pick(ADJECTIVES)} ${theme}`;
    const slug = `${slugify(name)}-${i}`;
    const seed = slugify(name) + i;
    return {
      creator_id: creatorId,
      name,
      slug,
      description: `${name} is a curated collection of ${randInt(10, 40)} unique on-chain pieces exploring generative art and collectible culture.`,
      logo_url: `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}-logo&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      banner_url: `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}-banner&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      contract_address: `0x${randomHex(40)}`,
      chain: pick(CHAINS),
      verified: Math.random() < 0.3,
      floor_price: randPrice(0.01, 5),
      volume: randPrice(1, 500),
    };
  });

  const { data, error } = await supabaseAdmin.from("collections").insert(collections).select("id, name");
  if (error) throw error;
  return data as { id: string; name: string }[];
}

function randomHex(length: number): string {
  let out = "";
  const chars = "0123456789abcdef";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function buildNfts(creatorId: string, collections: { id: string; name: string }[], count: number) {
  const nfts = [];
  for (let i = 0; i < count; i++) {
    const collection = pick(collections);
    const name = `${pick(ADJECTIVES)} ${pick(NOUNS)} #${randInt(1, 9999)}`;
    const seed = `${slugify(collection.name)}-nft-${i}`;
    nfts.push({
      creator_id: creatorId,
      collection_id: collection.id,
      name,
      description: `${name} from the ${collection.name} collection. One of many unique digital collectibles minted on-chain.`,
      image_url: `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`,
      animation_url: null,
      contract_address: `0x${randomHex(40)}`,
      token_id: String(i + 1),
      chain: pick(CHAINS),
      standard: pick(STANDARDS),
      metadata_uri: null,
      owner_address: `0x${randomHex(40)}`,
      status: pick(STATUSES),
    });
  }
  return nfts;
}

async function seedNfts(creatorId: string, collections: { id: string; name: string }[], total: number) {
  const all = buildNfts(creatorId, collections, total);
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    const { error } = await supabaseAdmin.from("nfts").insert(batch);
    if (error) throw error;
    inserted += batch.length;
    console.log(`  inserted ${inserted}/${all.length} nfts`);
  }
}

async function main() {
  const total = randInt(400, 500);
  console.log("Ensuring seed profile...");
  const creatorId = await ensureSeedProfile();
  console.log(`Seed profile id: ${creatorId}`);

  console.log("Seeding collections...");
  const collections = await seedCollections(creatorId);
  console.log(`Inserted ${collections.length} collections`);

  console.log(`Seeding ${total} nfts...`);
  await seedNfts(creatorId, collections, total);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
