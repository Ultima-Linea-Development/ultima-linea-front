import { Collection } from "mongodb";
import {
  Supplier,
  SupplierDocument,
  generateULID,
  supplierFromDoc,
  supplierToDoc,
} from "@/lib/server/models";
import { escapeRegex } from "@/lib/utils";

export type SupplierInput = {
  id?: string;
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  link?: string;
};

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export async function listSuppliers(
  collection: Collection<SupplierDocument>
): Promise<Supplier[]> {
  const docs = await collection.find({}).sort({ name: 1, _id: 1 }).toArray();
  return docs.map(supplierFromDoc);
}

export async function resolveSupplier(
  collection: Collection<SupplierDocument>,
  input: SupplierInput
): Promise<Supplier | null> {
  const supplierId = input.id?.trim();
  if (supplierId) {
    const doc = await collection.findOne({ _id: supplierId });
    return doc ? supplierFromDoc(doc) : null;
  }

  const trimmedName = input.name?.trim();
  if (!trimmedName) return null;

  const existing = await collection.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, "i") },
  });

  if (existing) {
    return supplierFromDoc(existing);
  }

  const now = new Date();
  const supplier: Supplier = {
    id: generateULID(),
    name: trimmedName,
    contact_name: trimOptional(input.contact_name),
    email: trimOptional(input.email),
    phone: trimOptional(input.phone),
    notes: trimOptional(input.notes),
    link: trimOptional(input.link),
    created_at: now,
    updated_at: now,
  };

  await collection.insertOne(supplierToDoc(supplier));
  return supplier;
}

export async function updateSupplier(
  collection: Collection<SupplierDocument>,
  id: string,
  input: Omit<SupplierInput, "id">
): Promise<Supplier | null> {
  const trimmedName = input.name?.trim();
  if (!trimmedName) return null;

  const now = new Date();
  const update = {
    name: trimmedName,
    contact_name: trimOptional(input.contact_name),
    email: trimOptional(input.email),
    phone: trimOptional(input.phone),
    notes: trimOptional(input.notes),
    link: trimOptional(input.link),
    updated_at: now,
  };

  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnDocument: "after" }
  );

  return result ? supplierFromDoc(result) : null;
}
