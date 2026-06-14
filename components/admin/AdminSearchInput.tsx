"use client";

import { KeyboardEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import Icon from "@/components/ui/Icons";
import {
  adminClearIconButtonClassName,
  adminMenuOptionClassName,
} from "@/lib/admin-interactive-styles";
import { zIndex } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type ListboxPosition = {
  top: number;
  left: number;
  width: number;
};

type AdminSearchInputProps<T> = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: ReactNode;
  className?: string;
  suggestions: T[];
  getSuggestionKey: (item: T, index: number) => string;
  renderSuggestion: (item: T) => ReactNode;
  onSuggestionSelect: (item: T) => void;
  onSubmit?: (query: string) => void;
  emptyMessage?: string;
  listboxId?: string;
};

export default function AdminSearchInput<T>({
  id,
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  disabled = false,
  required = false,
  label,
  className,
  suggestions,
  getSuggestionKey,
  renderSuggestion,
  onSuggestionSelect,
  onSubmit,
  emptyMessage = "No hay resultados",
  listboxId = "admin-search-listbox",
}: AdminSearchInputProps<T>) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [listboxPosition, setListboxPosition] = useState<ListboxPosition | null>(null);

  const visibleSuggestions = useMemo(() => {
    if (!value.trim()) return [];
    return suggestions;
  }, [suggestions, value]);

  const shouldShowListbox = isOpen && Boolean(value.trim());

  const updateListboxPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setListboxPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!shouldShowListbox) {
      setListboxPosition(null);
      return;
    }

    updateListboxPosition();

    window.addEventListener("resize", updateListboxPosition);
    window.addEventListener("scroll", updateListboxPosition, true);

    const anchor = anchorRef.current;
    const resizeObserver =
      anchor && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateListboxPosition)
        : null;

    if (anchor && resizeObserver) {
      resizeObserver.observe(anchor);
    }

    return () => {
      window.removeEventListener("resize", updateListboxPosition);
      window.removeEventListener("scroll", updateListboxPosition, true);
      resizeObserver?.disconnect();
    };
  }, [shouldShowListbox, updateListboxPosition, visibleSuggestions.length]);

  const closeList = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const selectSuggestion = (item: T) => {
    onSuggestionSelect(item);
    closeList();
  };

  useEffect(() => {
    if (highlightedIndex < 0 || !isOpen) return;
    document
      .getElementById(`${listboxId}-option-${highlightedIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen, listboxId]);

  useEffect(() => {
    if (highlightedIndex >= visibleSuggestions.length) {
      setHighlightedIndex(visibleSuggestions.length > 0 ? visibleSuggestions.length - 1 : -1);
    }
  }, [highlightedIndex, visibleSuggestions.length]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const hasQuery = Boolean(value.trim());
    const hasSuggestions = visibleSuggestions.length > 0;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!hasQuery || !hasSuggestions) return;

      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((current) => {
        if (event.key === "ArrowDown") {
          if (current < visibleSuggestions.length - 1) return current + 1;
          return 0;
        }

        if (current > 0) return current - 1;
        return visibleSuggestions.length - 1;
      });
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeList();
      return;
    }

    if (event.key === "Enter") {
      if (hasQuery && hasSuggestions && highlightedIndex >= 0) {
        event.preventDefault();
        const item = visibleSuggestions[highlightedIndex];
        if (item) selectSuggestion(item);
        return;
      }

      if (hasQuery && onSubmit) {
        event.preventDefault();
        onSubmit(value.trim());
        closeList();
      }
    }
  };

  const listbox =
    shouldShowListbox && listboxPosition ? (
      <div
        id={listboxId}
        role="listbox"
        style={{
          top: listboxPosition.top,
          left: listboxPosition.left,
          width: listboxPosition.width,
          zIndex: zIndex.dropdown,
        }}
        className="fixed max-h-64 overflow-y-auto border border-border bg-background shadow-md"
      >
        {visibleSuggestions.length === 0 ? (
          <div className="px-4 py-3">
            <Typography variant="body2" color="muted">
              {emptyMessage}
            </Typography>
          </div>
        ) : (
          visibleSuggestions.map((item, index) => {
            const isHighlighted = highlightedIndex === index;

            return (
              <button
                key={getSuggestionKey(item, index)}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isHighlighted}
                className={cn(
                  adminMenuOptionClassName({
                    selected: isHighlighted,
                    className: "items-center justify-between gap-3",
                  }),
                  isHighlighted && "ring-1 ring-inset ring-gray-300"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectSuggestion(item);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                disabled={disabled}
              >
                {renderSuggestion(item)}
              </button>
            );
          })
        )}
      </div>
    ) : null;

  return (
    <div className={cn("w-full min-w-0 max-w-none space-y-1", className)}>
      {label}
      <div ref={anchorRef} className="relative w-full min-w-0">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setHighlightedIndex(-1);
            setIsOpen(Boolean(event.target.value.trim()));
          }}
          onFocus={() => setIsOpen(Boolean(value.trim()))}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(closeList, 100);
          }}
          role="combobox"
          aria-expanded={isOpen && Boolean(value.trim())}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          style={{ paddingRight: value ? "2.75rem" : undefined }}
        />
        {value && (
          <button
            type="button"
            className={cn(
              adminClearIconButtonClassName,
              "absolute right-2 top-1/2 -translate-y-1/2"
            )}
            aria-label="Limpiar búsqueda"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onClear();
              closeList();
            }}
            disabled={disabled}
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>
      {mounted && listbox ? createPortal(listbox, document.body) : null}
    </div>
  );
}
