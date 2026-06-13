"use client";

import { useCallback, useEffect, useState } from "react";
import { PER_PAGE } from "@/components/admin/AdminSalesTable";
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
import { filterSalesByQuery } from "@/lib/admin-sales-search";
import { useAdminSearch } from "@/lib/hooks/use-admin-search";
import { usePendingDelete } from "@/lib/use-pending-delete";

type SalesListData = {
  sales: Sale[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export function useAdminSalesPanel() {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<SaleAssignableUser[]>([]);
  const [externalSellers, setExternalSellers] = useState<ExternalSeller[]>([]);
  const [salesData, setSalesData] = useState<SalesListData>();
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editError, setEditError] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deleteConfirmSale, setDeleteConfirmSale] = useState<Sale | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const {
    deleteToast,
    undoDuration,
    scheduleDelete,
    undoDelete,
    dismissDeleteToast,
    flushPendingDelete,
  } = usePendingDelete();

  const resetPage = useCallback(() => setPage(1), []);

  const {
    searchInput,
    setSearchInput,
    searchQuery,
    searchTick,
    searchSuggestions,
    searchCacheRef,
    applySearchFromQuery,
    clearSearch,
    invalidateSearchCache,
  } = useAdminSearch<Sale>({
    searchApi: (token, query) => adminSalesApi.search(token, query),
    filterCached: filterSalesByQuery,
  });

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

    setAssignableUsers(usersResponse.data?.users ?? []);
    setExternalSellers(externalSellersResponse.data?.sellers ?? []);
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
      const response = await adminSalesApi.getAll(token, { page, per_page: PER_PAGE });
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
  }, [page, searchQuery, flushPendingDelete, searchCacheRef]);

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

  const canDeleteSale = useCallback(
    (sale: Sale) =>
      canDeleteOwnedResource(getUserFromToken()?.role, getCurrentUserId(), sale.created_by),
    []
  );

  const data = salesData ?? undefined;
  const sales = data?.sales ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const currentPage = data?.page ?? page;

  return {
    isDataLoading,
    sales,
    total,
    totalPages,
    currentPage,
    page,
    setPage,
    products,
    assignableUsers,
    externalSellers,
    error,
    setError,
    success,
    setSuccess,
    searchInput,
    setSearchInput,
    searchSuggestions,
    deleteToast,
    undoDuration,
    undoDelete,
    dismissDeleteToast,
    showSaleForm,
    setShowSaleForm,
    viewingSale,
    setViewingSale,
    editingSale,
    setEditingSale,
    editError,
    setEditError,
    isEditSubmitting,
    isSubmitting,
    deleteConfirmSale,
    setDeleteConfirmSale,
    deleteError,
    setDeleteError,
    isDeleteSubmitting,
    applySearchFromQuery: (query: string) => applySearchFromQuery(query, resetPage),
    clearSearch: () => clearSearch(resetPage),
    handleCreateSale,
    handleSaveEdit,
    handleConfirmDelete,
    canDeleteSale,
    isAdmin: isAdmin(),
    getCurrentUserId,
    getToken,
    invalidateSearchCache,
  };
}
