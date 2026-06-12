import { Collection } from "mongodb";
import {
  ExternalSeller,
  ExternalSellerDocument,
  externalSellerFromDoc,
  externalSellerToDoc,
  generateULID,
} from "@/lib/server/models";
import { escapeRegex } from "@/lib/utils";

export async function listExternalSellers(
  collection: Collection<ExternalSellerDocument>
): Promise<ExternalSeller[]> {
  const docs = await collection.find({}).sort({ name: 1, _id: 1 }).toArray();
  return docs.map(externalSellerFromDoc);
}

export async function resolveExternalSeller(
  collection: Collection<ExternalSellerDocument>,
  input: { id?: string; name?: string }
): Promise<ExternalSeller | null> {
  const sellerId = input.id?.trim();
  if (sellerId) {
    const doc = await collection.findOne({ _id: sellerId });
    return doc ? externalSellerFromDoc(doc) : null;
  }

  const trimmedName = input.name?.trim();
  if (!trimmedName) return null;

  const existing = await collection.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, "i") },
  });

  if (existing) {
    return externalSellerFromDoc(existing);
  }

  const now = new Date();
  const seller: ExternalSeller = {
    id: generateULID(),
    name: trimmedName,
    created_at: now,
    updated_at: now,
  };

  await collection.insertOne(externalSellerToDoc(seller));
  return seller;
}
