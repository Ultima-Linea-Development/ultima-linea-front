import { cn } from "@/lib/utils";

/** 16px en mobile evita el zoom automático de Safari al enfocar campos. */
export const formControlFocusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const formControlSizeClassName =
  "block min-h-10 box-border py-2 px-4 text-base leading-normal md:text-sm";

export const formFieldClassName = cn(
  "w-full bg-gray-200",
  formControlSizeClassName,
  formControlFocusClassName
);
