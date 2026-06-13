"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import AdminDataLoading from "@/components/admin/AdminDataLoading";
import AdminUsersTable, { PER_PAGE } from "@/components/admin/AdminUsersTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminUserSearchSuggestion from "@/components/admin/AdminUserSearchSuggestion";
import AdminUserForm from "@/components/admin/AdminUserForm";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import { useAdminUsersPanel } from "@/lib/hooks/use-admin-users-panel";

export default function AdminUsersPage() {
  const panel = useAdminUsersPanel();

  return (
    <Box display="flex" direction="col" gap="6" className="min-h-[calc(100dvh-7rem)]">
      <Box display="flex" className="items-center justify-between flex-wrap gap-4">
        <Typography variant="h1">Usuarios</Typography>
        <Button
          type="button"
          onClick={() => {
            panel.setCreateError("");
            panel.setShowCreateModal(true);
          }}
        >
          Agregar usuario
        </Button>
      </Box>

      <AdminSearchInput
        value={panel.searchInput}
        onChange={panel.setSearchInput}
        onClear={panel.clearSearch}
        onSubmit={panel.applySearchFromQuery}
        onSuggestionSelect={(user) =>
          panel.applySearchFromQuery(`${user.first_name} ${user.last_name}`.trim() || user.email)
        }
        suggestions={panel.searchInput.trim() ? panel.searchSuggestions : []}
        getSuggestionKey={(user) => user.id}
        renderSuggestion={(user) => <AdminUserSearchSuggestion user={user} />}
        emptyMessage="No hay usuarios"
        listboxId="users-search-listbox"
        placeholder="Buscar por nombre, email o teléfono..."
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

      {panel.showCreateModal && (
        <Modal
          open={panel.showCreateModal}
          onClose={() => {
            if (panel.isSubmitting) return;
            panel.setCreateError("");
            panel.setShowCreateModal(false);
          }}
          title="Agregar usuario"
        >
          <AdminUserForm
            isSubmitting={panel.isSubmitting}
            error={panel.createError}
            onCreate={panel.handleCreateUser}
            onCancel={() => {
              if (panel.isSubmitting) return;
              panel.setCreateError("");
              panel.setShowCreateModal(false);
            }}
          />
        </Modal>
      )}

      {panel.editingUser && (
        <Modal
          open={!!panel.editingUser}
          onClose={() => {
            if (panel.isEditSubmitting || panel.isRequestingPasswordChange) return;
            panel.setEditError("");
            panel.setPasswordChangeError("");
            panel.setEditingUser(null);
          }}
          title="Editar usuario"
        >
          <AdminUserEditForm
            user={panel.editingUser}
            isSubmitting={panel.isEditSubmitting}
            isRequestingPasswordChange={panel.isRequestingPasswordChange}
            error={panel.editError}
            passwordChangeError={panel.passwordChangeError}
            onSave={panel.handleSaveEdit}
            onRequestPasswordChange={panel.handleRequestPasswordChange}
            onCancel={() => {
              if (panel.isEditSubmitting || panel.isRequestingPasswordChange) return;
              panel.setEditError("");
              panel.setPasswordChangeError("");
              panel.setEditingUser(null);
            }}
          />
        </Modal>
      )}

      <ConfirmDeleteModal
        open={!!panel.deleteConfirmUser}
        onClose={() => {
          panel.setDeleteConfirmUser(null);
          panel.setDeleteError("");
        }}
        title="Eliminar usuario"
        message={
          <>
            Estás seguro que deseas eliminar a {panel.deleteConfirmUser?.first_name}{" "}
            {panel.deleteConfirmUser?.last_name}?
          </>
        }
        error={panel.deleteError}
        actions={[
          {
            label: "Eliminar",
            variant: "delete",
            onClick: panel.handleConfirmDelete,
          },
          {
            label: "Cancelar",
            variant: "ghost",
            onClick: () => {
              panel.setDeleteConfirmUser(null);
              panel.setDeleteError("");
            },
          },
        ]}
      />

      {panel.isDataLoading ? (
        <AdminDataLoading />
      ) : (
        <AdminUsersTable
          users={panel.users}
          page={panel.currentPage}
          perPage={PER_PAGE}
          total={panel.total}
          totalPages={panel.totalPages}
          onPageChange={panel.setPage}
          onEdit={(user) => {
            panel.setEditError("");
            panel.setPasswordChangeError("");
            panel.setEditingUser(user);
          }}
          onDelete={(user) => {
            if (user.is_primary_admin) return;
            panel.setDeleteConfirmUser(user);
            panel.setDeleteError("");
          }}
        />
      )}
    </Box>
  );
}
