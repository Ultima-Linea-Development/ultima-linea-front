"use client";

import { FormEvent, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import Input, { InputAdornment } from "@/components/ui/Input";
import Div from "@/components/ui/Div";
import Typography from "@/components/ui/Typography";
import { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import type { CreateUserRequest } from "@/lib/api";
import { ROLES, USER_ROLE_OPTIONS } from "@/lib/roles";

type AdminUserFormProps = {
  isSubmitting: boolean;
  error?: string;
  onCreate: (payload: CreateUserRequest) => Promise<boolean>;
  onCancel?: () => void;
};

export default function AdminUserForm({
  isSubmitting,
  error,
  onCreate,
  onCancel,
}: AdminUserFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<CreateUserRequest["role"]>(ROLES.VENDEDOR);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

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
    if (password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden.");
      return;
    }

    const created = await onCreate({
      email: trimmedEmail,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      phone: phone.trim(),
      password,
      role,
    });

    if (created) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setRole(ROLES.VENDEDOR);
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const displayError = validationError || error;

  return (
    <Form onSubmit={handleSubmit} spacing="md">
      <Div spacing="md">
        <FormField htmlFor="user-email" label="Email" required>
          <Input
            id="user-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
            placeholder="admin@example.com"
          />
        </FormField>
      </Div>

      <Box display="grid" cols={2} gap={4}>
        <FormField htmlFor="user-first-name" label="Nombre" required>
          <Input
            id="user-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </FormField>

        <FormField htmlFor="user-last-name" label="Apellido" required>
          <Input
            id="user-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </FormField>
      </Box>

      <Div spacing="md">
        <FormField htmlFor="user-phone" label="Teléfono">
          <Input
            id="user-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={isSubmitting}
            placeholder="Opcional"
          />
        </FormField>
      </Div>

      <Div spacing="md">
        <FormField htmlFor="user-role" label="Rol" required>
          <Select
            id="user-role"
            value={role}
            onChange={(event) => setRole(event.target.value as CreateUserRequest["role"])}
            disabled={isSubmitting}
            required
          >
            {USER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </Div>

      <Div spacing="md">
        <FormField htmlFor="user-password" label="Contraseña" required>
          <Input
            id="user-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            width="full"
            endIcon={
              <InputAdornment
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
              >
                <Icon name={showPassword ? "visibilityOff" : "visibility"} className="size-5" />
              </InputAdornment>
            }
          />
        </FormField>
      </Div>

      <Div spacing="md">
        <FormField htmlFor="user-confirm-password" label="Confirmar contraseña" required>
          <Input
            id="user-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
            required
            minLength={6}
            placeholder="Repetí la contraseña"
            width="full"
            endIcon={
              <InputAdornment
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPassword((current) => !current)}
                disabled={isSubmitting}
              >
                <Icon
                  name={showConfirmPassword ? "visibilityOff" : "visibility"}
                  className="size-5"
                />
              </InputAdornment>
            }
          />
        </FormField>
      </Div>

      {displayError && (
        <InlineAlert variant="destructive">
          <Typography variant="body2" color="destructive">
            {displayError}
          </Typography>
        </InlineAlert>
      )}

      <Box display="flex" gap="2" className="flex-wrap">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear usuario"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
      </Box>
    </Form>
  );
}
