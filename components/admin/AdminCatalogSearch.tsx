"use client";

import { FormEvent } from "react";
import Icon from "@/components/ui/Icons";
import Input from "@/components/ui/Input";
import Form from "@/components/ui/Form";
import Div from "@/components/ui/Div";
import Box from "@/components/layout/Box";
import { Button } from "@/components/ui/button";

type AdminCatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  disabled?: boolean;
  hasActiveQuery: boolean;
};

export default function AdminCatalogSearch({
  value,
  onChange,
  onSubmit,
  onClear,
  disabled = false,
  hasActiveQuery,
}: AdminCatalogSearchProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit} className="w-full max-w-xl">
      <Box display="flex" direction="row" align="center" gap="2" className="w-full flex-wrap">
        <Div position="relative" width="full" className="min-w-[200px] flex-1">
          <Icon
            name="search"
            size={28}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar..."
            disabled={disabled}
          />
        </Div>
        <Box display="flex" gap="2" className="shrink-0">
          <Button type="submit" variant="outline" size="sm" disabled={disabled}>
            Buscar
          </Button>
          {hasActiveQuery && (
            <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onClear}>
              Limpiar
            </Button>
          )}
        </Box>
      </Box>
    </Form>
  );
}
