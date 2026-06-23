import Input from "@/components/ui/Input";
import {
  formatCurrencyInputValue,
  parseCurrencyInputValue,
} from "@/lib/currency-input";
import type { ComponentProps } from "react";

type CurrencyInputProps = Omit<
  ComponentProps<typeof Input>,
  "type" | "inputMode" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "$ 50.000",
  ...props
}: CurrencyInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={formatCurrencyInputValue(value)}
      onChange={(event) => onChange(parseCurrencyInputValue(event.target.value))}
      placeholder={placeholder}
    />
  );
}
