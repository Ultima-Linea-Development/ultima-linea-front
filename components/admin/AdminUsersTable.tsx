"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminTableMobileActionsMenu, {
  type AdminTableMobileAction,
} from "@/components/admin/AdminTableMobileActionsMenu";
import {
  AdminTable,
  AdminTableEmptyRow,
  AdminTableMobileCard,
  AdminTableMobileEmpty,
  AdminTableMobileField,
  AdminTableMobileGrid,
  AdminTableMobileList,
  AdminTablePagination,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_TH_CLASS,
} from "@/components/admin/AdminTable";
import type { AdminUser } from "@/lib/api";
import { formatUserRole } from "@/lib/roles";
import { formatSaleDateDisplay } from "@/lib/sale-date";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

type AdminUsersTableProps = {
  users: AdminUser[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
};

function formatUserName(user: AdminUser) {
  const name = `${user.first_name} ${user.last_name}`.trim();
  return name || "—";
}

export default function AdminUsersTable({
  users,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: AdminUsersTableProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;
  const hasActions = Boolean(onEdit || onDelete);
  const columnCount = hasActions ? 6 : 5;

  const getRowActions = (user: AdminUser): AdminTableMobileAction[] => {
    const actions: AdminTableMobileAction[] = [];

    if (onEdit) {
      actions.push({
        id: "edit",
        label: "Editar",
        icon: "edit",
        onClick: () => onEdit(user),
      });
    }

    if (onDelete && !user.is_primary_admin) {
      actions.push({
        id: "delete",
        label: "Eliminar",
        icon: "delete",
        onClick: () => onDelete(user),
        destructive: true,
      });
    }

    return actions;
  };

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      {users.length === 0 ? (
        <>
          <AdminTableMobileEmpty message="No hay usuarios" />
          <AdminTable>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={thClass}>
                  <Typography variant="body2">Nombre</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Email</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Teléfono</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Rol</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Creado</Typography>
                </th>
                {hasActions && (
                  <th className={thClass}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={columnCount} message="No hay usuarios" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {users.map((user) => (
              <AdminTableMobileCard key={user.id}>
                <Box display="flex" justify="between" align="start" gap="3" className="mb-3 w-full">
                  <Typography variant="body2" className="min-w-0 font-medium">
                    {formatUserName(user)}
                  </Typography>
                  {hasActions && <AdminTableMobileActionsMenu actions={getRowActions(user)} />}
                </Box>
                <AdminTableMobileGrid>
                  <AdminTableMobileField label="Email" fullWidth>
                    <Typography variant="body2" className="break-all">
                      {user.email}
                    </Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Teléfono">
                    <Typography variant="body2">{user.phone || "—"}</Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Rol">
                    <Typography variant="body2">{formatUserRole(user.role)}</Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Creado">
                    <Typography variant="body2">
                      {formatSaleDateDisplay(user.created_at)}
                    </Typography>
                  </AdminTableMobileField>
                </AdminTableMobileGrid>
              </AdminTableMobileCard>
            ))}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={thClass}>
                  <Typography variant="body2">Nombre</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Email</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Teléfono</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Rol</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Creado</Typography>
                </th>
                {hasActions && (
                  <th className={thClass}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30"
                >
                  <td className={cellClass}>
                    <Typography variant="body2">{formatUserName(user)}</Typography>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2" className="break-all">
                      {user.email}
                    </Typography>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{user.phone || "—"}</Typography>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{formatUserRole(user.role)}</Typography>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">
                      {formatSaleDateDisplay(user.created_at)}
                    </Typography>
                  </td>
                  {hasActions && (
                    <td className={cn(cellClass, "whitespace-nowrap")}>
                      <AdminTableMobileActionsMenu actions={getRowActions(user)} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </>
      )}

      <AdminTablePagination
        page={page}
        perPage={perPage}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Box>
  );
}

export { PER_PAGE };
