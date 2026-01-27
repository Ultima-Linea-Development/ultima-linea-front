"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Icon from "@/components/ui/Icons";
import Input from "@/components/ui/Input";
import Form from "@/components/ui/Form";
import Div from "@/components/ui/Div";
import Box from "@/components/layout/Box";

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
    <Form onSubmit={handleSubmit} className="w-full">
      <Box display="flex" direction="row" align="center" gap="2" className="w-full">
        <Div position="relative" width="full">
          <Icon
            name="search"
            size={28}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
          />
        </Div>
      </Box>
    </Form>
  );
}
