"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Alert, { InlineAlert } from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import AdminDataLoading from "@/components/admin/AdminDataLoading";
import AdminUsersTable, { PER_PAGE } from "@/components/admin/AdminUsersTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminUserSearchSuggestion from "@/components/admin/AdminUserSearchSuggestion";
import { filterUsersByQuery } from "@/lib/admin-users-search";
import AdminUserForm from "@/components/admin/AdminUserForm";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";
import { getToken } from "@/lib/auth";
import {
  adminUsersApi,
  type AdminUser,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "@/lib/api";
import { usePendingDelete } from "@/lib/use-pending-delete";

export default function AdminUsersPage() {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [usersData, setUsersData] = useState<{
    users: AdminUser[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }>();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTick, setSearchTick] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<AdminUser[]>([]);
  const searchCacheRef = useRef<{ query: string; results: AdminUser[] } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editError, setEditError] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState(false);
  const {
    deleteToast,
    undoDuration,
    scheduleDelete,
    undoDelete,
    dismissDeleteToast,
    flushPendingDelete,
  } = usePendingDelete();
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const loadUsers = useCallback(async () => {
    setIsDataLoading(true);
    try {
      await flushPendingDelete();
      const token = getToken();
      if (!token) {
        setError("Sesión expirada. Volvé a iniciar sesión.");
        return;
      }

      const q = searchQuery.trim();
      if (!q) {
        const response = await adminUsersApi.getAll(token, {
          page,
          per_page: PER_PAGE,
        });
        if (response.error || !response.data) {
          setError(response.error || "No se pudieron cargar los usuarios.");
          setUsersData(undefined);
          return;
        }

        setUsersData(response.data);
        return;
      }

      let all = searchCacheRef.current?.query === q ? searchCacheRef.current.results : null;
      if (!all) {
        const response = await adminUsersApi.search(token, q);
        if (response.error || !response.data) {
          setError(response.error || "Error al buscar usuarios.");
          setUsersData(undefined);
          return;
        }
        all = response.data.results;
        searchCacheRef.current = { query: q, results: all };
      }

      const total = all.length;
      const total_pages = Math.max(1, Math.ceil(total / PER_PAGE));
      const safePage = Math.min(Math.max(1, page), total_pages);
      const start = (safePage - 1) * PER_PAGE;
      setUsersData({
        users: all.slice(start, start + PER_PAGE),
        page: safePage,
        per_page: PER_PAGE,
        total,
        total_pages,
      });
      if (safePage !== page) {
        setPage(safePage);
      }
    } finally {
      setIsDataLoading(false);
    }
  }, [page, searchQuery, flushPendingDelete]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadUsers();
    });
  }, [loadUsers, searchTick]);

  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      setSearchSuggestions([]);
      return;
    }

    if (searchCacheRef.current) {
      const cached = searchCacheRef.current;
      if (cached.query === query) {
        setSearchSuggestions(cached.results.slice(0, 8));
      } else {
        const filtered = filterUsersByQuery(cached.results, query, 8);
        if (filtered.length > 0) {
          setSearchSuggestions(filtered);
        }
      }
    }

    const timer = setTimeout(() => {
      const token = getToken();
      if (!token) {
        setSearchSuggestions([]);
        return;
      }

      void adminUsersApi.search(token, query).then((response) => {
        if (response.data) {
          setSearchSuggestions(response.data.results.slice(0, 8));
          return;
        }
        setSearchSuggestions([]);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const applySearchFromQuery = useCallback((query: string) => {
    searchCacheRef.current = null;
    setSearchInput(query);
    setSearchQuery(query.trim());
    setPage(1);
    setSearchTick((tick) => tick + 1);
  }, []);

  const clearSearch = useCallback(() => {
    searchCacheRef.current = null;
    setSearchInput("");
    setSearchQuery("");
    setSearchSuggestions([]);
    setPage(1);
    setSearchTick((tick) => tick + 1);
  }, []);

  const handleOpenCreateModal = () => {
    setCreateError("");
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (isSubmitting) return;
    setCreateError("");
    setShowCreateModal(false);
  };

  const handleCreateUser = useCallback(
    async (payload: CreateUserRequest) => {
      const token = getToken();
      if (!token) {
        setCreateError("Sesión expirada. Volvé a iniciar sesión.");
        return false;
      }

      setCreateError("");
      setIsSubmitting(true);

      const response = await adminUsersApi.create(payload, token);
      if (response.error || !response.data) {
        setCreateError(response.error || "No se pudo crear el usuario.");
        setIsSubmitting(false);
        return false;
      }

      setSuccess("Usuario creado correctamente.");
      setShowCreateModal(false);
      setPage(1);

      const listResponse = await adminUsersApi.getAll(token, {
        page: 1,
        per_page: PER_PAGE,
      });
      if (listResponse.data) {
        setUsersData(listResponse.data);
      }

      setIsSubmitting(false);
      return true;
    },
    []
  );

  const handleEdit = (user: AdminUser) => {
    setEditError("");
    setPasswordChangeError("");
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    if (isEditSubmitting || isRequestingPasswordChange) return;
    setEditError("");
    setPasswordChangeError("");
    setEditingUser(null);
  };

  const handleSaveEdit = useCallback(
    async (payload: UpdateUserRequest) => {
      if (!editingUser) return false;

      await flushPendingDelete();
      const token = getToken();
      if (!token) {
        setEditError("Sesión expirada. Volvé a iniciar sesión.");
        return false;
      }

      setEditError("");
      setIsEditSubmitting(true);

      const response = await adminUsersApi.update(editingUser.id, payload, token);
      if (response.error || !response.data) {
        setEditError(response.error || "No se pudo actualizar el usuario.");
        setIsEditSubmitting(false);
        return false;
      }

      setSuccess("Usuario actualizado correctamente.");
      setEditingUser(null);
      await loadUsers();
      setIsEditSubmitting(false);
      return true;
    },
    [editingUser, flushPendingDelete, loadUsers]
  );

  const handleRequestPasswordChange = useCallback(async () => {
    if (!editingUser) return false;

    const token = getToken();
    if (!token) {
      setPasswordChangeError("Sesión expirada. Volvé a iniciar sesión.");
      return false;
    }

    setPasswordChangeError("");
    setIsRequestingPasswordChange(true);

    const response = await adminUsersApi.requestPasswordChange(editingUser.id, token);
    if (response.error || !response.data) {
      setPasswordChangeError(response.error || "No se pudo solicitar el cambio de contraseña.");
      setIsRequestingPasswordChange(false);
      return false;
    }

    setEditingUser(response.data);
    setSuccess("Se solicitó el cambio de contraseña. El usuario deberá definir una nueva al ingresar.");
    await loadUsers();
    setIsRequestingPasswordChange(false);
    return true;
  }, [editingUser, loadUsers]);

  const handleDelete = (user: AdminUser) => {
    if (user.is_primary_admin) return;
    setDeleteConfirmUser(user);
    setDeleteError("");
  };

  const handleCancelDelete = () => {
    setDeleteConfirmUser(null);
    setDeleteError("");
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirmUser || deleteConfirmUser.is_primary_admin) return;

    const user = deleteConfirmUser;
    const usersSnapshot = usersData;

    setDeleteConfirmUser(null);
    setDeleteError("");
    setError("");

    setUsersData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        users: prev.users.filter((item) => item.id !== user.id),
        total: Math.max(0, prev.total - 1),
      };
    });

    await scheduleDelete({
      message: "Usuario eliminado correctamente.",
      restore: () => setUsersData(usersSnapshot),
      commit: async () => {
        const token = getToken();
        if (!token) {
          setUsersData(usersSnapshot);
          setError("Sesión expirada. Volvé a iniciar sesión.");
          return;
        }

        const response = await adminUsersApi.delete(user.id, token);
        if (response.error) {
          setUsersData(usersSnapshot);
          setError(response.error);
          return;
        }

        await loadUsers();
      },
    });
  }, [deleteConfirmUser, usersData, scheduleDelete, loadUsers]);

  const data = usersData ?? undefined;
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const currentPage = data?.page ?? page;

  return (
    <Box display="flex" direction="col" gap="6" className="min-h-[calc(100dvh-7rem)]">
        <Box display="flex" className="items-center justify-between flex-wrap gap-4">
          <Typography variant="h1">Usuarios</Typography>
          <Button type="button" onClick={handleOpenCreateModal}>
            Agregar usuario
          </Button>
        </Box>

        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          onClear={clearSearch}
          onSubmit={applySearchFromQuery}
          onSuggestionSelect={(user) =>
            applySearchFromQuery(
              `${user.first_name} ${user.last_name}`.trim() || user.email
            )
          }
          suggestions={searchInput.trim() ? searchSuggestions : []}
          getSuggestionKey={(user) => user.id}
          renderSuggestion={(user) => <AdminUserSearchSuggestion user={user} />}
          emptyMessage="No hay usuarios"
          listboxId="users-search-listbox"
          placeholder="Buscar por nombre, email o teléfono..."
        />

        <Alert
          open={!!error}
          message={error}
          variant="destructive"
          onClose={() => setError("")}
        />

        <Alert
          open={!!success}
          message={success}
          variant="default"
          onClose={() => setSuccess("")}
        />

        <Alert
          open={!!deleteToast}
          message={deleteToast}
          variant="default"
          duration={undoDuration}
          onClose={dismissDeleteToast}
          onUndo={undoDelete}
        />

        {showCreateModal && (
          <Modal open={showCreateModal} onClose={handleCloseCreateModal} title="Agregar usuario">
            <AdminUserForm
              isSubmitting={isSubmitting}
              error={createError}
              onCreate={handleCreateUser}
              onCancel={handleCloseCreateModal}
            />
          </Modal>
        )}

        {editingUser && (
          <Modal open={!!editingUser} onClose={handleCancelEdit} title="Editar usuario">
            <AdminUserEditForm
              user={editingUser}
              isSubmitting={isEditSubmitting}
              isRequestingPasswordChange={isRequestingPasswordChange}
              error={editError}
              passwordChangeError={passwordChangeError}
              onSave={handleSaveEdit}
              onRequestPasswordChange={handleRequestPasswordChange}
              onCancel={handleCancelEdit}
            />
          </Modal>
        )}

        {deleteConfirmUser && (
          <Modal open={!!deleteConfirmUser} onClose={handleCancelDelete} title="Eliminar usuario">
            <Box display="flex" direction="col" gap="4">
              <Typography variant="body2">
                Estás seguro que deseas eliminar a {deleteConfirmUser.first_name}{" "}
                {deleteConfirmUser.last_name}?
              </Typography>
              {deleteError && (
                <InlineAlert variant="destructive">
                  <Typography variant="body2" color="destructive">
                    {deleteError}
                  </Typography>
                </InlineAlert>
              )}
              <Box display="flex" gap="2" className="flex-wrap">
                <Button type="button" variant="delete" onClick={handleConfirmDelete}>
                  Eliminar
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancelDelete}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

        {isDataLoading ? (
          <AdminDataLoading />
        ) : (
          <AdminUsersTable
            users={users}
            page={currentPage}
            perPage={PER_PAGE}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
    </Box>
  );
}
