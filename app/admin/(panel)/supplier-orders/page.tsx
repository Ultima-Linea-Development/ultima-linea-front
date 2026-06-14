"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import AdminSupplierOrderDetail from "@/components/admin/AdminSupplierOrderDetail";
import AdminSupplierOrderEditForm from "@/components/admin/AdminSupplierOrderEditForm";
import AdminSupplierOrderForm from "@/components/admin/AdminSupplierOrderForm";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import AdminSupplierOrdersTable, { PER_PAGE } from "@/components/admin/AdminSupplierOrdersTable";
import { ADMIN_PAGE_PADDING_CLASS } from "@/components/admin/AdminTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminSupplierOrderSearchSuggestion from "@/components/admin/AdminSupplierOrderSearchSuggestion";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { useAdminSupplierOrdersPanel } from "@/lib/hooks/use-admin-supplier-orders-panel";
import { cn } from "@/lib/utils";

export default function AdminSupplierOrdersPage() {
  const panel = useAdminSupplierOrdersPanel();

  return (
    <Box display="flex" direction="col" gap="6" className="w-full min-w-0">
      <div className={cn("flex flex-col gap-6", ADMIN_PAGE_PADDING_CLASS)}>
        <Box display="flex" className="items-center justify-between flex-wrap gap-4">
          <Typography variant="h1">Pedidos</Typography>
          <Button type="button" onClick={() => panel.setShowOrderForm(true)}>
            Agregar pedido
          </Button>
        </Box>

        <AdminSearchInput
          value={panel.searchInput}
          onChange={panel.setSearchInput}
          onClear={panel.clearSearch}
          onSubmit={panel.applySearchFromQuery}
          onSuggestionSelect={(order) =>
            panel.applySearchFromQuery(panel.getSupplierOrderLabel(order))
          }
          suggestions={panel.searchInput.trim() ? panel.searchSuggestions : []}
          getSuggestionKey={(order) => order.id}
          renderSuggestion={(order) => <AdminSupplierOrderSearchSuggestion order={order} />}
          emptyMessage="No hay pedidos"
          listboxId="supplier-orders-search-listbox"
          placeholder="Buscar por pedido, proveedor, camiseta, dorsal..."
        />

        <Alert open={!!panel.error} message={panel.error} variant="destructive" onClose={() => panel.setError("")} />
        <Alert open={!!panel.success} message={panel.success} variant="default" onClose={() => panel.setSuccess("")} />
        <Alert
          open={!!panel.deleteToast}
          message={panel.deleteToast}
          variant="default"
          duration={panel.undoDuration}
          onClose={panel.dismissDeleteToast}
          onUndo={panel.undoDelete}
        />
      </div>

      {panel.showOrderForm && (
        <Modal
          open={panel.showOrderForm}
          onClose={() => {
            if (panel.isSubmitting) return;
            panel.setShowOrderForm(false);
          }}
          title="Agregar pedido"
          className="max-w-4xl"
        >
          <AdminSupplierOrderForm
            suppliers={panel.suppliers}
            isSubmitting={panel.isSubmitting}
            onCreate={panel.handleCreateOrder}
            onCancel={() => panel.setShowOrderForm(false)}
            onError={(message) => {
              panel.setSuccess("");
              panel.setError(message);
            }}
          />
        </Modal>
      )}

      {panel.viewingOrder && (
        <Modal
          open={!!panel.viewingOrder}
          onClose={() => panel.setViewingOrder(null)}
          title={panel.viewingOrder.name}
          className="max-w-5xl"
        >
          <AdminSupplierOrderDetail order={panel.viewingOrder} />
        </Modal>
      )}

      {panel.editingOrder && (
        <Modal
          open={!!panel.editingOrder}
          onClose={() => {
            if (panel.isEditSubmitting) return;
            panel.setEditError("");
            panel.setEditingOrder(null);
          }}
          title="Editar pedido"
          className="max-w-4xl"
        >
          <AdminSupplierOrderEditForm
            order={panel.editingOrder}
            suppliers={panel.suppliers}
            isSubmitting={panel.isEditSubmitting}
            onSave={panel.handleSaveEdit}
            onCancel={() => {
              if (panel.isEditSubmitting) return;
              panel.setEditError("");
              panel.setEditingOrder(null);
            }}
            onError={(message) => panel.setEditError(message)}
          />
          {panel.editError && (
            <Box className="mt-4">
              <Alert
                open={!!panel.editError}
                message={panel.editError}
                variant="destructive"
                onClose={() => panel.setEditError("")}
              />
            </Box>
          )}
        </Modal>
      )}

      <ConfirmDeleteModal
        open={!!panel.deleteConfirmOrder}
        onClose={() => {
          panel.setDeleteConfirmOrder(null);
          panel.setDeleteError("");
        }}
        title="Eliminar pedido"
        message="Estás seguro que deseas eliminar este pedido?"
        error={panel.deleteError}
        actions={[
          {
            label: "Eliminar",
            variant: "delete",
            onClick: panel.handleConfirmDelete,
            disabled: panel.isDeleteSubmitting,
            loadingLabel: "...",
          },
          {
            label: "Cancelar",
            variant: "ghost",
            onClick: () => {
              panel.setDeleteConfirmOrder(null);
              panel.setDeleteError("");
            },
            disabled: panel.isDeleteSubmitting,
          },
        ]}
      />

      <div className="w-full min-w-0">
        {panel.isDataLoading ? (
          <AdminTableSkeleton variant="sales" />
        ) : (
          <AdminSupplierOrdersTable
            orders={panel.orders}
            page={panel.currentPage}
            perPage={PER_PAGE}
            total={panel.total}
            totalPages={panel.totalPages}
            onPageChange={panel.setPage}
            onViewDetails={panel.setViewingOrder}
            onEdit={(order) => {
              panel.setEditError("");
              panel.setEditingOrder(order);
            }}
            onDelete={(order) => {
              panel.setDeleteConfirmOrder(order);
              panel.setDeleteError("");
            }}
            canDeleteOrder={panel.canDeleteOrder}
          />
        )}
      </div>
    </Box>
  );
}
