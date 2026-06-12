"use client";

import { ClipboardEvent, useRef } from "react";
import Input, { InputAdornment } from "@/components/ui/Input";
import Icon from "@/components/ui/Icons";
import {
  formatSaleDateInputDisplay,
  normalizeSaleDateInputDisplay,
  parseSaleDateInput,
  saleDateInputToApiValue,
} from "@/lib/sale-date";

type AdminSaleDateFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

function openNativeDatePicker(input: HTMLInputElement) {
  if (typeof input.showPicker === "function") {
    input.showPicker();
    return;
  }

  input.click();
}

export default function AdminSaleDateField({
  id,
  value,
  onChange,
  disabled = false,
  required = false,
}: AdminSaleDateFieldProps) {
  const nativeDateRef = useRef<HTMLInputElement>(null);
  const nativeValue = saleDateInputToApiValue(value) ?? "";

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    const normalized = normalizeSaleDateInputDisplay(pasted);
    if (!normalized) return;

    event.preventDefault();
    onChange(normalized);
  };

  const handleBlur = () => {
    const normalized = normalizeSaleDateInputDisplay(value);
    if (normalized && normalized !== value) {
      onChange(normalized);
    }
  };

  const handleNativeDateChange = (nextValue: string) => {
    if (!nextValue) return;

    const parsed = parseSaleDateInput(nextValue);
    if (!parsed) return;

    onChange(formatSaleDateInputDisplay(parsed));
  };

  const handleOpenCalendar = () => {
    if (disabled || !nativeDateRef.current) return;
    openNativeDatePicker(nativeDateRef.current);
  };

  return (
    <div className="relative w-full">
      <input
        ref={nativeDateRef}
        type="date"
        value={nativeValue}
        onChange={(event) => handleNativeDateChange(event.target.value)}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPaste={handlePaste}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        placeholder="DD/MM/AAAA"
        spellCheck={false}
        endIcon={
          <InputAdornment
            type="button"
            aria-label="Abrir calendario"
            onClick={handleOpenCalendar}
            disabled={disabled}
          >
            <Icon name="calendar" className="size-5" />
          </InputAdornment>
        }
      />
    </div>
  );
}
