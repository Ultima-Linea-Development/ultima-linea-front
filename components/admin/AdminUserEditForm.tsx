"use client";

import { FormEvent, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Div from "@/components/ui/Div";
import Typography from "@/components/ui/Typography";
import { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import type { AdminUser, UpdateUserRequest, UserRole } from "@/lib/api";
import { formFieldClassName } from "@/lib/form-field-classes";
import { ROLES, USER_ROLE_OPTIONS } from "@/lib/roles";

type AdminUserEditFormProps = {
  user: AdminUser;
  isSubmitting: boolean;
  isRequestingPasswordChange?: boolean;
  error?: string;
  passwordChangeError?: string;
  onSave: (payload: UpdateUserRequest) => Promise<boolean>;
  onRequestPasswordChange?: () => Promise<boolean>;
  onCancel?: () => void;
};

export default function AdminUserEditForm({
  user,
  isSubmitting,
  isRequestingPasswordChange = false,
  error,
  passwordChangeError,
  onSave,
  onRequestPasswordChange,
  onCancel,
}: AdminUserEditFormProps) {
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [role, setRole] = useState<UserRole>(
    user.role === ROLES.ADMIN || user.role === ROLES.VENDEDOR ? user.role : ROLES.VENDEDOR
  );
  const [validationError, setValidationError] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(
    user.must_change_password === true
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedEmail) {
      setValidationError("El email es obligatorio.");
      return;
    }
    if (!trimmedFirstName) {
      setValidationError("El nombre es obligatorio.");
      return;
    }
    if (!trimmedLastName) {
      setValidationError("El apellido es obligatorio.");
      return;
    }

    const payload: UpdateUserRequest = {
      email: trimmedEmail,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      phone: phone.trim(),
      role,
    };

    await onSave(payload);
  };

  const handleRequestPasswordChange = async () => {
    if (!onRequestPasswordChange || mustChangePassword) return;

    const requested = await onRequestPasswordChange();
    if (requested) {
      setMustChangePassword(true);
    }
  };

  const displayError = validationError || error;
  const isBusy = isSubmitting || isRequestingPasswordChange;

  return (
    <Form onSubmit={handleSubmit} spacing="md">
      <Div spacing="md">
        <Label htmlFor="edit-user-email" display="block" spacing="sm">
          <Typography variant="body2" mb={1}>
            Email *
          </Typography>
          <Input
            id="edit-user-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isBusy}
            required
          />
        </Label>
      </Div>

      <Box display="grid" cols={2} gap={4}>
        <Label htmlFor="edit-user-first-name" display="block" spacing="sm">
          <Typography variant="body2" mb={1}>
            Nombre *
          </Typography>
          <Input
            id="edit-user-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isBusy}
            required
          />
        </Label>

        <Label htmlFor="edit-user-last-name" display="block" spacing="sm">
          <Typography variant="body2" mb={1}>
            Apellido *
          </Typography>
          <Input
            id="edit-user-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isBusy}
            required
          />
        </Label>
      </Box>

      <Div spacing="md">
        <Label htmlFor="edit-user-phone" display="block" spacing="sm">
          <Typography variant="body2" mb={1}>
            Teléfono
          </Typography>
          <Input
            id="edit-user-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={isBusy}
            placeholder="Opcional"
          />
        </Label>
      </Div>

      <Div spacing="md">
        <Label htmlFor="edit-user-role" display="block" spacing="sm">
          <Typography variant="body2" mb={1}>
            Rol *
          </Typography>
          <select
            id="edit-user-role"
            value={role}
            onChange={(event) => setRole(event.target.value as UpdateUserRequest["role"])}
            disabled={isBusy}
            required
            className={formFieldClassName}
          >
            {USER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Label>
      </Div>

      <Div spacing="md">
        <Typography variant="body2" mb={1}>
          Contraseña
        </Typography>
        {mustChangePassword ? (
          <Typography variant="body2" className="text-muted-foreground">
            El usuario deberá definir una nueva contraseña al iniciar sesión.
          </Typography>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleRequestPasswordChange}
            disabled={isBusy || !onRequestPasswordChange}
          >
            {isRequestingPasswordChange
              ? "Solicitando..."
              : "Solicitar cambio de contraseña"}
          </Button>
        )}
        {passwordChangeError ? (
          <InlineAlert variant="destructive">
            <Typography variant="body2" color="destructive">
              {passwordChangeError}
            </Typography>
          </InlineAlert>
        ) : null}
      </Div>

      {displayError && (
        <InlineAlert variant="destructive">
          <Typography variant="body2" color="destructive">
            {displayError}
          </Typography>
        </InlineAlert>
      )}

      <Box display="flex" gap="2" className="flex-wrap">
        <Button type="submit" disabled={isBusy}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isBusy}>
            Cancelar
          </Button>
        )}
      </Box>
    </Form>
  );
}
