/**
 * Normaliza nombres, slugs y temporadas de todos los productos.
 * Uso:
 *   npx tsx scripts/migrate-product-names.ts
 *   npx tsx scripts/migrate-product-names.ts --dry-run
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { applyProductNameNormalization } from "../lib/product-name";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function buildMongoUri(): string {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT } = process.env;
  return `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT || "27017"}/?authSource=admin`;
}

async function main() {
  loadEnvFile();
  const dryRun = process.argv.includes("--dry-run");
  const uri = buildMongoUri();
  const dbName = process.env.MONGODB_DATABASE || "camisetas";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db(dbName).collection("products");
    const docs = await collection.find({}).toArray();

    let updated = 0;
    let skipped = 0;

    for (const doc of docs) {
      const team = String(doc.team ?? "").trim();
      const season = String(doc.season ?? "").trim();
      if (!team || !season) {
        console.log(`SKIP ${doc._id}: sin equipo o temporada`);
        skipped += 1;
        continue;
      }

      const normalized = applyProductNameNormalization({
        team,
        season,
        type: doc.type,
        name: doc.name,
      });

      const currentName = String(doc.name ?? "").trim();
      const currentSlug = String(doc.slug ?? "").trim();
      const currentSeason = String(doc.season ?? "").trim();
      const currentType = String(doc.type ?? "").trim().toLowerCase();

      if (
        currentName === normalized.name &&
        currentSlug === normalized.slug &&
        currentSeason === normalized.season &&
        currentType === normalized.type
      ) {
        skipped += 1;
        continue;
      }

      console.log(`\n${doc._id}`);
      console.log(`  antes:  ${currentName}`);
      console.log(`  slug:   ${currentSlug}`);
      console.log(`  season: ${currentSeason}`);
      console.log(`  type:   ${currentType}`);
      console.log(`  después:${normalized.name}`);
      console.log(`  slug:   ${normalized.slug}`);
      console.log(`  season: ${normalized.season}`);
      console.log(`  type:   ${normalized.type}`);

      if (!dryRun) {
        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              name: normalized.name,
              slug: normalized.slug,
              season: normalized.season,
              type: normalized.type,
              updated_at: new Date(),
            },
          }
        );
      }

      updated += 1;
    }

    console.log(
      `\n${dryRun ? "[dry-run] " : ""}Actualizados: ${updated}. Sin cambios: ${skipped}. Total: ${docs.length}.`
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
