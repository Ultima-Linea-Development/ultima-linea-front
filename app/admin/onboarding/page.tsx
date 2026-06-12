"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import Input, { InputAdornment } from "@/components/ui/Input";
import Form from "@/components/ui/Form";
import Label from "@/components/ui/Label";
import Div from "@/components/ui/Div";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icons";
import Logo from "@/components/brand/Logo";
import { authApi } from "@/lib/api";
import { getStoredUser, getToken, setAuthSession } from "@/lib/auth";

const MIN_PASSWORD_LENGTH = 8;

export default function AdminOnboardingPage() {
  const router = useRouter();
  const storedUser = getStoredUser();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(storedUser?.phone ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Sesión expirada. Volvé a iniciar sesión.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.completeSetup(
        {
          password,
          phone: phone.trim(),
        },
        token
      );

      if (response.error || !response.data) {
        setError(response.error || "No se pudo completar la configuración.");
        setLoading(false);
        return;
      }

      setAuthSession(response.data.token, response.data.user);
      router.replace("/admin");
    } catch {
      setError("Error de conexión. Intentá nuevamente.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        direction="col"
        justify="start"
        align="center"
        gap="4"
      >
        <Box display="flex" direction="col" gap="2" className="w-full max-w-md">
          <Box display="flex" justify="center" className="mb-2">
            <Logo />
          </Box>

          <Typography variant="h2" uppercase={true} align="center">
            Configurá tu cuenta
          </Typography>

          {storedUser ? (
            <Typography variant="body2" align="center" className="text-muted-foreground">
              Hola, {storedUser.first_name}. Antes de continuar, definí tu contraseña y teléfono.
            </Typography>
          ) : null}

          <Form onSubmit={handleSubmit} spacing="md" mt={4}>
            <Div spacing="md">
              <Label htmlFor="password" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Nueva contraseña
                </Typography>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  width="full"
                  disabled={loading}
                  endIcon={
                    <InputAdornment
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={loading}
                    >
                      <Icon
                        name={showPassword ? "visibilityOff" : "visibility"}
                        className="size-5"
                      />
                    </InputAdornment>
                  }
                />
              </Label>
            </Div>

            <Div spacing="md">
              <Label htmlFor="confirmPassword" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Confirmar contraseña
                </Typography>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  width="full"
                  disabled={loading}
                  endIcon={
                    <InputAdornment
                      aria-label={
                        showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      disabled={loading}
                    >
                      <Icon
                        name={showConfirmPassword ? "visibilityOff" : "visibility"}
                        className="size-5"
                      />
                    </InputAdornment>
                  }
                />
              </Label>
            </Div>

            <Div spacing="md">
              <Label htmlFor="phone" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Teléfono
                </Typography>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  width="full"
                  disabled={loading}
                />
              </Label>
            </Div>

            <Alert
              open={!!error}
              message={error}
              variant="destructive"
              onClose={() => setError("")}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Continuar"}
            </Button>
          </Form>
        </Box>
      </Box>
    </Container>
  );
}
