"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Alert, { InlineAlert } from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import AdminSaleDetail from "@/components/admin/AdminSaleDetail";
import AdminSaleEditForm from "@/components/admin/AdminSaleEditForm";
import AdminSaleForm from "@/components/admin/AdminSaleForm";
import AdminDataLoading from "@/components/admin/AdminDataLoading";
import AdminSalesTable, { PER_PAGE } from "@/components/admin/AdminSalesTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminSaleSearchSuggestion from "@/components/admin/AdminSaleSearchSuggestion";
import { filterSalesByQuery } from "@/lib/admin-sales-search";
import { formatSaleProductsLabel } from "@/lib/sale-items";
import { Button } from "@/components/ui/button";
import { getToken, getUserFromToken, getCurrentUserId, isAdmin } from "@/lib/auth";
import { canDeleteOwnedResource } from "@/lib/roles";
import {
  adminSalesApi,
  type CreateSaleRequest,
  type Product,
  type Sale,
  type ExternalSeller,
  type SaleAssignableUser,
  type UpdateSaleRequest,
} from "@/lib/api";
import { usePendingDelete } from "@/lib/use-pending-delete";

export default function AdminSalesPage() {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<SaleAssignableUser[]>([]);
  const [externalSellers, setExternalSellers] = useState<ExternalSeller[]>([]);
  const [salesData, setSalesData] = useState<{
    sales: Sale[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }>();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTick, setSearchTick] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<Sale[]>([]);
  const searchCacheRef = useRef<{ query: string; results: Sale[] } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    deleteToast,
    undoDuration,
    scheduleDelete,
    undoDelete,
    dismissDeleteToast,
    flushPendingDelete,
  } = usePendingDelete();
  const [deleteConfirmSale, setDeleteConfirmSale] = useState<Sale | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editError, setEditError] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const loadSaleFormData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Sesión expirada. Volvé a iniciar sesión.");
      return;
    }

    const [productsResponse, usersResponse, externalSellersResponse] = await Promise.all([
      adminSalesApi.getAvailableProducts(token),
      adminSalesApi.getAssignableUsers(token),
      adminSalesApi.getExternalSellers(token),
    ]);

    if (productsResponse.error || !productsResponse.data) {
      setError(productsResponse.error || "No se pudieron cargar los productos.");
      setProducts([]);
    } else {
      setProducts(productsResponse.data.products);
    }

    if (usersResponse.error || !usersResponse.data) {
      setAssignableUsers([]);
    } else {
      setAssignableUsers(usersResponse.data.users);
    }

    if (externalSellersResponse.error || !externalSellersResponse.data) {
      setExternalSellers([]);
    } else {
      setExternalSellers(externalSellersResponse.data.sellers);
    }
  }, []);

  const loadSales = useCallback(async () => {
    await flushPendingDelete();
    const token = getToken();
    if (!token) {
      setError("Sesión expirada. Volvé a iniciar sesión.");
      return;
    }

    const q = searchQuery.trim();
    if (!q) {
      const response = await adminSalesApi.getAll(token, {
        page,
        per_page: PER_PAGE,
      });
      if (response.error || !response.data) {
        setError(response.error || "No se pudieron cargar las ventas.");
        setSalesData(undefined);
        return;
      }

      setSalesData(response.data);
      return;
    }

    let all = searchCacheRef.current?.query === q ? searchCacheRef.current.results : null;
    if (!all) {
      const response = await adminSalesApi.search(token, q);
      if (response.error || !response.data) {
        setError(response.error || "Error al buscar ventas.");
        setSalesData(undefined);
        return;
      }
      all = response.data.results;
      searchCacheRef.current = { query: q, results: all };
    }

    const total = all.length;
    const total_pages = Math.max(1, Math.ceil(total / PER_PAGE));
    const safePage = Math.min(Math.max(1, page), total_pages);
    const start = (safePage - 1) * PER_PAGE;
    setSalesData({
      sales: all.slice(start, start + PER_PAGE),
      page: safePage,
      per_page: PER_PAGE,
      total,
      total_pages,
    });
    if (safePage !== page) {
      setPage(safePage);
    }
  }, [page, searchQuery, flushPendingDelete]);

  const refreshSalesPanel = useCallback(async () => {
    setIsDataLoading(true);
    try {
      await Promise.all([loadSaleFormData(), loadSales()]);
    } finally {
      setIsDataLoading(false);
    }
  }, [loadSaleFormData, loadSales]);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshSalesPanel();
    });
  }, [refreshSalesPanel, searchTick]);

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
        const filtered = filterSalesByQuery(cached.results, query, 8);
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

      void adminSalesApi.search(token, query).then((response) => {
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

  const handleCreateSale = useCallback(
    async (payload: CreateSaleRequest) => {
      await flushPendingDelete();
      const token = getToken();
      if (!token) {
        setError("Sesión expirada. Volvé a iniciar sesión.");
        return false;
      }

      setError("");
      setSuccess("");
      setIsSubmitting(true);

      const response = await adminSalesApi.create(payload, token);
      if (response.error || !response.data) {
        setError(response.error || "No se pudo registrar la venta.");
        setIsSubmitting(false);
        return false;
      }

      setSuccess("Venta registrada correctamente.");
      await refreshSalesPanel();
      setIsSubmitting(false);
      setShowSaleForm(false);
      return true;
    },
    [refreshSalesPanel, flushPendingDelete]
  );

  const handleDelete = (sale: Sale) => {
    setDeleteConfirmSale(sale);
    setDeleteError("");
  };

  const handleCancelDelete = () => {
    setDeleteConfirmSale(null);
    setDeleteError("");
  };

  const handleViewDetails = (sale: Sale) => {
    setViewingSale(sale);
  };

  const handleEdit = (sale: Sale) => {
    setEditError("");
    setEditingSale(sale);
  };

  const handleCancelEdit = () => {
    if (isEditSubmitting) return;
    setEditError("");
    setEditingSale(null);
  };

  const handleSaveEdit = useCallback(
    async (payload: UpdateSaleRequest) => {
      if (!editingSale) return false;

      await flushPendingDelete();
      const token = getToken();
      if (!token) {
        setEditError("Sesión expirada. Volvé a iniciar sesión.");
        return false;
      }

      setEditError("");
      setIsEditSubmitting(true);

      const response = await adminSalesApi.update(editingSale.id, payload, token);
      if (response.error || !response.data) {
        setEditError(response.error || "No se pudo actualizar la venta.");
        setIsEditSubmitting(false);
        return false;
      }

      setSuccess("Venta actualizada correctamente.");
      setEditingSale(null);
      await loadSales();
      setIsEditSubmitting(false);
      return true;
    },
    [editingSale, loadSales, flushPendingDelete]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirmSale) return;
    const sale = deleteConfirmSale;
    const salesSnapshot = salesData;

    setDeleteConfirmSale(null);
    setIsDeleteSubmitting(false);
    setDeleteError("");
    setError("");

    setSalesData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sales: prev.sales.filter((item) => item.id !== sale.id),
        total: Math.max(0, prev.total - 1),
      };
    });

    await scheduleDelete({
      message: "Venta eliminada correctamente.",
      restore: () => setSalesData(salesSnapshot),
      commit: async () => {
        const token = getToken();
        if (!token) {
          setSalesData(salesSnapshot);
          setError("Sesión expirada. Volvé a iniciar sesión.");
          return;
        }

        const response = await adminSalesApi.delete(sale.id, token);
        if (response.error) {
          setSalesData(salesSnapshot);
          setError(response.error);
          return;
        }

        await refreshSalesPanel();
      },
    });
  }, [deleteConfirmSale, salesData, scheduleDelete, refreshSalesPanel]);

  const data = salesData ?? undefined;
  const sales = data?.sales ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const currentPage = data?.page ?? page;

  return (
    <Box display="flex" direction="col" gap="6" className="min-h-[calc(100dvh-7rem)]">
        <Box display="flex" className="items-center justify-between flex-wrap gap-4">
          <Typography variant="h1">Ventas</Typography>
          <Button type="button" onClick={() => setShowSaleForm(true)}>
            Agregar venta
          </Button>
        </Box>

        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          onClear={clearSearch}
          onSubmit={applySearchFromQuery}
          onSuggestionSelect={(sale) => applySearchFromQuery(formatSaleProductsLabel(sale))}
          suggestions={searchInput.trim() ? searchSuggestions : []}
          getSuggestionKey={(sale) => sale.id}
          renderSuggestion={(sale) => <AdminSaleSearchSuggestion sale={sale} />}
          emptyMessage="No hay ventas"
          listboxId="sales-search-listbox"
          placeholder="Buscar por producto, vendedor, alias o talle..."
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

        {showSaleForm && (
          <Modal
            open={showSaleForm}
            onClose={() => {
              if (isSubmitting) return;
              setShowSaleForm(false);
            }}
            title="Agregar venta"
            className="max-w-3xl"
          >
            <AdminSaleForm
              products={products}
              assignableUsers={assignableUsers}
              externalSellers={externalSellers}
              currentUserId={getCurrentUserId()}
              canAssignUser={isAdmin()}
              isSubmitting={isSubmitting}
              onCreate={handleCreateSale}
              onCancel={() => setShowSaleForm(false)}
              onError={(message) => {
                setSuccess("");
                setError(message);
              }}
            />
          </Modal>
        )}

        {viewingSale && (
          <Modal
            open={!!viewingSale}
            onClose={() => setViewingSale(null)}
            title="Detalle de venta"
            className="max-w-2xl"
          >
            <AdminSaleDetail
              sale={viewingSale}
              products={products}
              assignableUsers={assignableUsers}
            />
          </Modal>
        )}

        {editingSale && (
          <Modal open={!!editingSale} onClose={handleCancelEdit} title="Editar venta" className="max-w-3xl">
            <AdminSaleEditForm
              sale={editingSale}
              assignableUsers={assignableUsers}
              externalSellers={externalSellers}
              currentUserId={getCurrentUserId()}
              canAssignUser={isAdmin()}
              isSubmitting={isEditSubmitting}
              error={editError}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          </Modal>
        )}

        {deleteConfirmSale && (
          <Modal open={!!deleteConfirmSale} onClose={handleCancelDelete} title="Eliminar venta">
            <Box display="flex" direction="col" gap="4">
              <Typography variant="body2">
                Estás seguro que deseas eliminar esta venta?
              </Typography>
              {deleteError && (
                <InlineAlert variant="destructive">
                  <Typography variant="body2" color="destructive">
                    {deleteError}
                  </Typography>
                </InlineAlert>
              )}
              <Box display="flex" gap="2" className="flex-wrap">
                <Button
                  type="button"
                  variant="delete"
                  onClick={handleConfirmDelete}
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

        {isDataLoading ? (
          <AdminDataLoading />
        ) : (
          <AdminSalesTable
            sales={sales}
            products={products}
            assignableUsers={assignableUsers}
            page={currentPage}
            perPage={PER_PAGE}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canDeleteSale={(sale) =>
              canDeleteOwnedResource(getUserFromToken()?.role, getCurrentUserId(), sale.created_by)
            }
          />
        )}
    </Box>
  );
}
