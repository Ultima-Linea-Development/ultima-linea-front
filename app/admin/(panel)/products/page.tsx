"use client";

import { useState } from "react";
import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";
import Typography from "@/components/ui/Typography";
import Alert, { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import AdminDataLoading from "@/components/admin/AdminDataLoading";
import AdminProductsTable, { PER_PAGE } from "@/components/admin/AdminProductsTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminProductSearchSuggestion from "@/components/admin/AdminProductSearchSuggestion";
import AdminProductEditForm from "@/components/admin/AdminProductEditForm";
import AdminProductForm from "@/components/admin/AdminProductForm";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Modal from "@/components/ui/Modal";
import { isAdmin, getToken } from "@/lib/auth";
import { type Product } from "@/lib/api";
import {
  useAdminProductsCatalog,
  useAdminProductEdit,
} from "@/lib/hooks/use-admin-products-catalog";

export default function AdminProductsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const catalog = useAdminProductsCatalog();
  const edit = useAdminProductEdit(catalog.refreshCatalog, catalog.flushPendingDelete);

  const handleDelete = (product: Product) => {
    setDeleteConfirmProduct(product);
    setDeleteError("");
    catalog.setBulkError("");
  };

  const handleCancelDelete = () => {
    setDeleteConfirmProduct(null);
    setDeleteError("");
  };

  const handleConfirmDesactivar = async () => {
    if (!deleteConfirmProduct) return;
    setIsDeleteSubmitting(true);
    setDeleteError("");
    try {
      await catalog.confirmDeactivate(deleteConfirmProduct);
      setDeleteConfirmProduct(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al desactivar.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!deleteConfirmProduct) return;
    const product = deleteConfirmProduct;
    setDeleteConfirmProduct(null);
    setIsDeleteSubmitting(false);
    setDeleteError("");
    await catalog.confirmSingleDelete(product);
  };

  return (
    <Box display="flex" direction="col" gap="6" className="min-h-[calc(100dvh-7rem)]">
      <Box display="flex" className="items-center justify-between flex-wrap gap-4">
        <Typography variant="h1">Catálogo</Typography>
        <Button type="button" onClick={() => setShowCreateModal(true)}>
          Agregar producto
        </Button>
      </Box>

      <AdminSearchInput
        value={catalog.searchInput}
        onChange={catalog.setSearchInput}
        onClear={catalog.clearSearch}
        onSubmit={catalog.applySearchFromQuery}
        onSuggestionSelect={(product) => catalog.applySearchFromQuery(product.name)}
        suggestions={catalog.searchInput.trim() ? catalog.searchSuggestions : []}
        getSuggestionKey={(product) => product.id}
        renderSuggestion={(product) => <AdminProductSearchSuggestion product={product} />}
        emptyMessage="No hay productos"
        listboxId="catalog-product-listbox"
      />

      <Alert
        open={!!catalog.deleteToast}
        message={catalog.deleteToast}
        variant="default"
        duration={catalog.undoDuration}
        onClose={catalog.dismissDeleteToast}
        onUndo={catalog.undoDelete}
      />
      <Alert open={!!catalog.error} message={catalog.error} variant="destructive" onClose={() => catalog.setError("")} />
      <Alert open={!!catalog.success} message={catalog.success} variant="default" onClose={() => catalog.setSuccess("")} />
      <Alert open={!!catalog.bulkError} message={catalog.bulkError} variant="destructive" onClose={() => catalog.setBulkError("")} />

      {showCreateModal && (
        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Agregar producto" className="max-w-2xl">
          <AdminProductForm
            onSuccess={() => {
              catalog.setSuccess("Producto creado correctamente.");
              setShowCreateModal(false);
              catalog.setPage(1);
              void catalog.loadCatalog();
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      <ConfirmDeleteModal
        open={!!deleteConfirmProduct}
        onClose={handleCancelDelete}
        title="Eliminar artículo"
        message="Estás seguro que deseas eliminar este artículo?"
        error={deleteError}
        actions={[
          {
            label: "Desactivar",
            variant: "warning",
            onClick: handleConfirmDesactivar,
            disabled: isDeleteSubmitting,
            loadingLabel: "...",
          },
          {
            label: "Eliminar",
            variant: "delete",
            onClick: handleConfirmEliminar,
            disabled: isDeleteSubmitting,
            loadingLabel: "...",
          },
          {
            label: "Cancelar",
            variant: "ghost",
            onClick: handleCancelDelete,
            disabled: isDeleteSubmitting,
          },
        ]}
      />

      <ConfirmDeleteModal
        open={!!catalog.bulkConfirmIds?.length}
        onClose={() => {
          catalog.setBulkConfirmIds(null);
          catalog.setBulkError("");
        }}
        title="Eliminar artículos"
        message={
          <>
            Estás seguro que deseas eliminar {catalog.bulkConfirmIds?.length ?? 0} artículo
            {catalog.bulkConfirmIds?.length === 1 ? "" : "s"}?
          </>
        }
        error={catalog.bulkError}
        actions={[
          {
            label: "Eliminar",
            variant: "delete",
            onClick: catalog.handleBulkEliminarConfirm,
            disabled: catalog.isBulkSubmitting,
            loadingLabel: "...",
          },
          {
            label: "Cancelar",
            variant: "outline",
            onClick: () => {
              catalog.setBulkConfirmIds(null);
              catalog.setBulkError("");
            },
            disabled: catalog.isBulkSubmitting,
          },
        ]}
      />

      {edit.editingProductId && (
        <Modal open={!!edit.editingProductId} onClose={edit.handleCancelEdit} title="Editar producto">
          {edit.isLoadingProduct ? (
            <Box display="flex" className="min-h-[200px] items-center justify-center">
              <Spinner fullscreen={false} />
            </Box>
          ) : edit.editingProduct ? (
            <AdminProductEditForm
              product={edit.editingProduct}
              onSave={edit.handleSaveEdit}
              onCancel={edit.handleCancelEdit}
              isSubmitting={edit.isEditSubmitting}
              error={edit.editError}
              getToken={getToken}
            />
          ) : edit.editError ? (
            <InlineAlert variant="destructive">
              <Typography variant="body2" color="destructive">
                {edit.editError}
              </Typography>
            </InlineAlert>
          ) : null}
        </Modal>
      )}

      {catalog.isDataLoading ? (
        <AdminDataLoading />
      ) : (
        <AdminProductsTable
          products={catalog.list}
          page={catalog.currentPage}
          perPage={PER_PAGE}
          total={catalog.total}
          totalPages={catalog.totalPages}
          onPageChange={catalog.setPage}
          onEdit={edit.handleEdit}
          onDeactivate={catalog.handleDeactivate}
          onReactivate={catalog.handleReactivate}
          onDelete={handleDelete}
          canDeleteProduct={catalog.canDeleteProduct}
          selectedIds={catalog.selectedIds}
          onSelectionChange={isAdmin() ? catalog.setSelectedIds : undefined}
          categoryFilter={catalog.categoryFilter}
          sizeFilter={catalog.sizeFilter}
          activeFilter={catalog.activeFilter}
          sizeOptions={catalog.sizeOptions}
          onCategoryFilterChange={catalog.handleCategoryFilterChange}
          onSizeFilterChange={catalog.handleSizeFilterChange}
          onActiveFilterChange={catalog.handleActiveFilterChange}
          tableFooter={
            catalog.selectedIds.length > 0 ? (
              <Box
                display="flex"
                className="items-center justify-between gap-4 flex-wrap border border-border bg-muted/30 p-3"
              >
                <Typography variant="body2">
                  {catalog.selectedIds.length} seleccionado
                  {catalog.selectedIds.length === 1 ? "" : "s"}
                </Typography>
                <Box display="flex" gap="2" className="flex-wrap">
                  <Button
                    type="button"
                    variant="warning"
                    size="sm"
                    onClick={catalog.handleBulkDesactivar}
                    disabled={catalog.isBulkSubmitting}
                  >
                    {catalog.isBulkSubmitting ? "..." : "Desactivar"}
                  </Button>
                  <Button
                    type="button"
                    variant="delete"
                    size="sm"
                    onClick={() => {
                      if (catalog.selectedIds.length === 0) return;
                      catalog.setBulkConfirmIds([...catalog.selectedIds]);
                      catalog.setBulkError("");
                    }}
                    disabled={catalog.isBulkSubmitting}
                  >
                    Eliminar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      catalog.setSelectedIds([]);
                      catalog.setBulkError("");
                    }}
                    disabled={catalog.isBulkSubmitting}
                  >
                    Cancelar selección
                  </Button>
                </Box>
              </Box>
            ) : null
          }
        />
      )}
    </Box>
  );
}
