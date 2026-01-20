"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icons";

type SearchInputProps = {
  className?: string;
};

export default function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <div className="relative w-full">
        <Icon
          name="search"
          size={28}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="py-2 px-4 bg-gray-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
        />
      </div>
    </form>
  );
}
