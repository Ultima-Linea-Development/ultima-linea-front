"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";
import Typography from "@/components/ui/Typography";
import Alert from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/AdminShell";
import AdminProductsTable, { PER_PAGE } from "@/components/admin/AdminProductsTable";
import AdminProductEditForm from "@/components/admin/AdminProductEditForm";
import Modal from "@/components/ui/Modal";
import { isAdmin, getUserFromToken, clearAuth, getToken } from "@/lib/auth";
import { productsApi, adminProductsApi, type Product, type UpdateProductRequest } from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [products, setProducts] = useState<Awaited<ReturnType<typeof productsApi.getAll>>["data"]>(undefined);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editError, setEditError] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkConfirmIds, setBulkConfirmIds] = useState<string[] | null>(null);
  const [bulkError, setBulkError] = useState("");

  const fetchProducts = useCallback(async (currentPage: number) => {
    setError("");
    const response = await productsApi.getAll({
      page: currentPage,
      per_page: PER_PAGE,
    });
    if (response.error) {
      setError(response.error);
      setProducts(undefined);
      return;
    }
    setProducts(response.data ?? undefined);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = getUserFromToken();

      if (!user || !isAdmin()) {
        clearAuth();
        router.push("/login?redirect=/admin/products");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;
    fetchProducts(page);
  }, [isAuthorized, page, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProduct(null);
    setEditError("");
    setBulkError("");
  };

  useEffect(() => {
    if (!editingProductId) return;
    setIsLoadingProduct(true);
    setEditError("");
    productsApi
      .getById(editingProductId)
      .then((response) => {
        if (response.error || !response.data) {
          setEditError(response.error ?? "No se pudo cargar el producto.");
          return;
        }
        setEditingProduct(response.data);
      })
      .finally(() => setIsLoadingProduct(false));
  }, [editingProductId]);

  const handleSaveEdit = useCallback(
    async (payload: UpdateProductRequest) => {
      if (!editingProduct) return;
      const token = getToken();
      if (!token) {
        setEditError("Sesión expirada. Volvé a iniciar sesión.");
        return;
      }
      setIsEditSubmitting(true);
      setEditError("");
      const response = await adminProductsApi.update(editingProduct.id, payload, token);
      if (response.error) {
        setEditError(response.error);
        setIsEditSubmitting(false);
        return;
      }
      setEditingProductId(null);
      setEditingProduct(null);
      await fetchProducts(page);
      setIsEditSubmitting(false);
    },
    [editingProduct, page, fetchProducts]
  );

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct(null);
    setEditError("");
  };

  const handleDelete = (product: Product) => {
    setDeleteConfirmProduct(product);
    setDeleteError("");
    setBulkError("");
  };

  const handleCancelDelete = () => {
    setDeleteConfirmProduct(null);
    setDeleteError("");
  };

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setBulkError("");
  };

  const handleBulkDesactivar = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const token = getToken();
    if (!token) {
      setBulkError("Sesión expirada.");
      return;
    }
    const count = selectedIds.length;
    setIsBulkSubmitting(true);
    setBulkError("");
    let failed = 0;
    for (const id of selectedIds) {
      const res = await adminProductsApi.update(id, { is_active: false }, token);
      if (res.error) failed++;
    }
    setSelectedIds([]);
    await fetchProducts(page);
    setIsBulkSubmitting(false);
    if (failed > 0) setBulkError(`${failed} de ${count} no se pudieron desactivar.`);
  }, [selectedIds, page, fetchProducts]);

  const handleBulkEliminarClick = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmIds([...selectedIds]);
    setBulkError("");
  };

  const handleBulkEliminarConfirm = useCallback(async () => {
    if (!bulkConfirmIds?.length) return;
    const token = getToken();
    if (!token) {
      setBulkError("Sesión expirada.");
      return;
    }
    const count = bulkConfirmIds.length;
    setIsBulkSubmitting(true);
    setBulkError("");
    let failed = 0;
    for (const id of bulkConfirmIds) {
      const res = await adminProductsApi.delete(id, token);
      if (res.error) failed++;
    }
    setBulkConfirmIds(null);
    setSelectedIds([]);
    await fetchProducts(page);
    setIsBulkSubmitting(false);
    if (failed > 0) setBulkError(`${failed} de ${count} no se pudieron eliminar.`);
  }, [bulkConfirmIds, page, fetchProducts]);

  const handleBulkCancel = () => {
    setBulkConfirmIds(null);
    setBulkError("");
  };

  const handleConfirmDesactivar = useCallback(async () => {
    if (!deleteConfirmProduct) return;
    const token = getToken();
    if (!token) {
      setDeleteError("Sesión expirada. Volvé a iniciar sesión.");
      return;
    }
    setIsDeleteSubmitting(true);
    setDeleteError("");
    const response = await adminProductsApi.update(
      deleteConfirmProduct.id,
      { is_active: false },
      token
    );
    if (response.error) {
      setDeleteError(response.error);
      setIsDeleteSubmitting(false);
      return;
    }
    setDeleteConfirmProduct(null);
    await fetchProducts(page);
    setIsDeleteSubmitting(false);
  }, [deleteConfirmProduct, page, fetchProducts]);

  const handleConfirmEliminar = useCallback(async () => {
    if (!deleteConfirmProduct) return;
    const token = getToken();
    if (!token) {
      setDeleteError("Sesión expirada. Volvé a iniciar sesión.");
      return;
    }
    setIsDeleteSubmitting(true);
    setDeleteError("");
    const response = await adminProductsApi.delete(deleteConfirmProduct.id, token);
    if (response.error) {
      setDeleteError(response.error);
      setIsDeleteSubmitting(false);
      return;
    }
    setDeleteConfirmProduct(null);
    await fetchProducts(page);
    setIsDeleteSubmitting(false);
  }, [deleteConfirmProduct, page, fetchProducts]);

  if (isLoading) {
    return (
      <Box display="flex" direction="col" gap="4" className="min-h-[60vh] items-center justify-center">
        <Spinner />
      </Box>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const data = products ?? undefined;
  const list = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const currentPage = data?.page ?? 1;

  return (
    <AdminShell>
      <Box display="flex" direction="col" gap="6">
        <Box display="flex" className="items-center justify-between flex-wrap gap-4">
          <Typography variant="h1">Catálogo</Typography>
          <Button asChild>
            <Link href="/admin/add-product">Agregar producto</Link>
          </Button>
        </Box>

        {error && (
          <Alert variant="destructive">
            <Typography variant="body2" color="destructive">
              {error}
            </Typography>
          </Alert>
        )}

        {bulkError && (
          <Alert variant="destructive">
            <Typography variant="body2" color="destructive">
              {bulkError}
            </Typography>
          </Alert>
        )}

        {deleteConfirmProduct && (
          <Modal open={!!deleteConfirmProduct} onClose={handleCancelDelete} title="Eliminar artículo">
            <Box display="flex" direction="col" gap="4">
              <Typography variant="body2">
                Estás seguro que deseas eliminar este artículo?
              </Typography>
              {deleteError && (
                <Alert variant="destructive">
                  <Typography variant="body2" color="destructive">
                    {deleteError}
                  </Typography>
                </Alert>
              )}
              <Box display="flex" gap="2" className="flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleConfirmDesactivar}
                  disabled={isDeleteSubmitting}
                >
                  {isDeleteSubmitting ? "..." : "Desactivar"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmEliminar}
                  disabled={isDeleteSubmitting}
                >
                  {isDeleteSubmitting ? "..." : "Eliminar"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelDelete}
                  disabled={isDeleteSubmitting}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

        {bulkConfirmIds && bulkConfirmIds.length > 0 && (
          <Modal
            open={!!bulkConfirmIds?.length}
            onClose={handleBulkCancel}
            title="Eliminar artículos"
          >
            <Box display="flex" direction="col" gap="4">
              <Typography variant="body2">
                Estás seguro que deseas eliminar {bulkConfirmIds.length} artículo
                {bulkConfirmIds.length === 1 ? "" : "s"}?
              </Typography>
              {bulkError && (
                <Alert variant="destructive">
                  <Typography variant="body2" color="destructive">
                    {bulkError}
                  </Typography>
                </Alert>
              )}
              <Box display="flex" gap="2" className="flex-wrap">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleBulkEliminarConfirm}
                  disabled={isBulkSubmitting}
                >
                  {isBulkSubmitting ? "..." : "Eliminar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBulkCancel}
                  disabled={isBulkSubmitting}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

        {editingProductId && (
          <Modal open={!!editingProductId} onClose={handleCancelEdit} title="Editar producto">
            {isLoadingProduct ? (
              <Box display="flex" className="min-h-[200px] items-center justify-center">
                <Spinner />
              </Box>
            ) : editingProduct ? (
              <AdminProductEditForm
                product={editingProduct}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                isSubmitting={isEditSubmitting}
                error={editError}
                getToken={getToken}
              />
            ) : editError ? (
              <Alert variant="destructive">
                <Typography variant="body2" color="destructive">
                  {editError}
                </Typography>
              </Alert>
            ) : null}
          </Modal>
        )}

        {selectedIds.length > 0 && (
          <Box
            display="flex"
            className="items-center justify-between gap-4 flex-wrap border border-border bg-muted/30 p-3"
          >
            <Typography variant="body2">
              {selectedIds.length} seleccionado{selectedIds.length === 1 ? "" : "s"}
            </Typography>
            {bulkError && (
              <Typography variant="body2" color="destructive">
                {bulkError}
              </Typography>
            )}
            <Box display="flex" gap="2" className="flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBulkDesactivar}
                disabled={isBulkSubmitting}
              >
                {isBulkSubmitting ? "..." : "Desactivar"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleBulkEliminarClick}
                disabled={isBulkSubmitting}
              >
                Eliminar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                disabled={isBulkSubmitting}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
        )}

        <AdminProductsTable
          products={list}
          page={currentPage}
          perPage={PER_PAGE}
          total={total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
        />
      </Box>
    </AdminShell>
  );
}
