import type { Supplier } from "@/lib/api";

export const NEW_SUPPLIER_VALUE = "__new_supplier__";

export type SupplierFormValue = {
  supplierId: string;
  supplierName: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
  link: string;
};

export function createDefaultSupplierValue(): SupplierFormValue {
  return {
    supplierId: "",
    supplierName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
    link: "",
  };
}

export function supplierToFormValue(supplier?: Supplier | null): SupplierFormValue {
  if (!supplier) return createDefaultSupplierValue();

  return {
    supplierId: supplier.id,
    supplierName: supplier.name,
    contactName: supplier.contact_name ?? "",
    email: supplier.email ?? "",
    phone: supplier.phone ?? "",
    notes: supplier.notes ?? "",
    link: supplier.link ?? "",
  };
}

export function validateSupplierValue(value: SupplierFormValue): string | null {
  if (value.supplierId === NEW_SUPPLIER_VALUE && !value.supplierName.trim()) {
    return "Ingresá el nombre del proveedor.";
  }

  return null;
}

export function supplierValueToPayload(value: SupplierFormValue) {
  if (value.supplierId && value.supplierId !== NEW_SUPPLIER_VALUE) {
    return { supplier_id: value.supplierId };
  }

  const name = value.supplierName.trim();
  if (!name) return {};

  return {
    supplier_name: name,
    supplier_contact_name: value.contactName.trim() || undefined,
    supplier_email: value.email.trim() || undefined,
    supplier_phone: value.phone.trim() || undefined,
    supplier_notes: value.notes.trim() || undefined,
    supplier_link: value.link.trim() || undefined,
  };
}
