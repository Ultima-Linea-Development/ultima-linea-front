# Estandarización de estilos y componetización

Instructivo de diseño y realización de código para agentes de IA (Cursor, etc.) y desarrolladores del proyecto **Última Línea**.

---

## 1. Principio rector

> **Revisar primero, escribir después.** Cada cambio debe reutilizar componentes, utilidades y tokens existentes. El objetivo es código limpio, ordenado y con el mínimo CSS/clases nuevas posible.

Antes de implementar cualquier UI:

1. Buscar en `components/ui/`, `components/layout/`, `components/admin/`, `components/navigation/`.
2. Buscar utilidades en `lib/` (`utils.ts`, `form-field-classes.ts`, `admin-interactive-styles.ts`, `design-tokens.ts`).
3. Verificar si `globals.css` ya expone el token de color/espacio necesario.
4. Solo si no existe nada reutilizable: crear o extender con el diff más pequeño posible.

---

## 2. Arquitectura de carpetas

```
components/
├── ui/              Primitivos reutilizables (Button, Input, Typography, Modal…)
├── layout/          Estructura de página (Container, Box, NavBar, MobileMenu…)
├── admin/           Dominio del panel (prefijo Admin*)
├── navigation/      Links de navegación pública (NavLink, FooterLink)
├── brand/           Logo y configuración de marca
└── [feature]/       Componentes de una feature (ej. guia-de-talles/)

app/
├── components/      Componentes acoplados a rutas del sitio (Header, Footer…)
├── globals.css      Único archivo CSS del proyecto
└── [rutas]/         Páginas; deben componerse, no acumular markup

lib/
├── utils.ts         cn(), helpers de negocio
├── design-tokens.ts zIndex (y tokens documentales)
├── form-field-classes.ts  Clases para <select> nativos
├── admin-interactive-styles.ts  Hover/active del panel admin
└── fonts.ts         Variables de fuentes
```

### Convenciones de nombres

| Regla | Ejemplo |
|-------|---------|
| Archivos en PascalCase | `Typography.tsx`, `AdminProductForm.tsx` |
| Excepción shadcn | `components/ui/button.tsx` |
| Prefijo Admin en panel | `AdminSalesTable.tsx` |
| Imports con alias `@/` | `import Container from "@/components/layout/Container"` |
| Button: named export | `import { Button } from "@/components/ui/button"` |
| Resto: default export | `import Typography from "@/components/ui/Typography"` |

---

## 3. Sistema de estilos

### 3.1 Tailwind + CSS variables

- **Tailwind v4** importado en `app/globals.css`.
- Paleta basada en variables HSL tipo shadcn: `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, `--delete`, `--warning`, `--border`, `--ring`.
- `--radius: 0` → diseño con esquinas rectas (salvo excepciones como botones redondos o WhatsApp flotante).
- Fuentes: `--font-archivo` (cuerpo), `--font-archivo-black` (títulos/headings).

**No crear archivos `.css` adicionales.** Animaciones globales (ej. `animate-shimmer`) van en `globals.css`.

### 3.2 Composición de clases

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", condición && "clase-condicional", className)} />
```

- Siempre usar `cn()` para merge seguro (clsx + tailwind-merge).
- Variantes complejas: **class-variance-authority** (CVA), como en `button.tsx`.

### 3.3 Tokens de diseño

| Fuente | Uso |
|--------|-----|
| `globals.css` | Colores, fuentes, tema dark |
| `lib/design-tokens.ts` → `zIndex` | Capas (toast, modal, dropdown). **Usar siempre** en overlays y menús |
| `lib/form-field-classes.ts` | `<select>` nativos en forms admin |
| `lib/admin-interactive-styles.ts` | Links, menús e iconos interactivos del panel |

> `spacing`, `sizes`, `breakpoints` y `typography` en `design-tokens.ts` están documentados pero **no se consumen** en el código actual. Preferir props de componentes (`Typography`, `Box`, `Container`) o clases Tailwind estándar.

### 3.4 Z-index

Usar `zIndex` de `design-tokens.ts`:

```ts
import { zIndex } from "@/lib/design-tokens";
// zIndex.toast, zIndex.modal, zIndex.dropdown, etc.
```

Evitar valores arbitrarios (`z-[55]`, `z-[100]`) salvo migración pendiente.

---

## 4. Inventario de componentes UI

### 4.1 Primitivos (`components/ui/`)

| Componente | Cuándo usarlo |
|------------|---------------|
| `Typography` | Todo texto: títulos, párrafos, captions. Props: `variant`, `align`, `color`, `mb`, `uppercase` |
| `Paragraph` | Evitar; usar `Typography variant="body"` directamente |
| `Button` | Toda acción clickeable. Variantes: `default`, `ctaSolid`, `ctaOutline`, `delete`, `warning`, `ghost`, `outline`… |
| `Input` / `Textarea` | Campos de texto. Props: `background`, `size`, `startIcon`, `endIcon` |
| `InputAdornment` | Botones dentro de inputs (clear, iconos interactivos) |
| `Label` | Envoltorio de campos. Props: `display`, `spacing` |
| `Form` | Formularios con `spacing` vertical |
| `Alert` / `InlineAlert` | Mensajes y toasts |
| `Modal` | Diálogos y confirmaciones |
| `Spinner` | Estados de carga |
| `Container` | Contenedor de página con padding y max-width |
| `Box` | Flex/grid declarativo (`display`, `gap`, `cols`, `justify`, `align`) |
| `Div` | Div semántico con props de padding, border, background, etc. |
| `Main`, `Nav`, `Footer` | Landmarks HTML |
| `Banner` | Hero/banner responsive |
| `ProductCard`, `ProductImageGallery`, `ProductTags`, `ProductFeatureHighlights` | Dominio tienda |
| `SearchInput` | Búsqueda pública en header |
| `ImageUploadDropzone`, `SortableImageGrid` | Upload de imágenes admin |
| `Lightbox` | Galería fullscreen |
| `Icons` | Wrapper unificado de iconos |

### 4.2 Layout (`components/layout/`)

- `Container` — wrapper principal de contenido
- `Box` — grillas y flex sin clases crudas en páginas
- `NavBar`, `NavLinks`, `MobileMenu`, `MobileSearch`, `ConditionalLayout`

### 4.3 Navegación

- **Tienda pública**: `components/navigation/NavLink.tsx` (underline animado, cierra mobile menu)
- **Panel admin**: `components/admin/AdminNavLink.tsx` (estado activo + `adminNavLinkClassName`)
- **No unificar** ambos en un solo componente; son dominios distintos

### 4.4 Admin (`components/admin/`)

Componentes de dominio: tablas, forms, búsquedas, sugerencias. Reutilizar:

- `AdminSearchInput`, `AdminDataLoading`
- `admin-interactive-styles` para hover/focus
- `formFieldClassName` para `<select>` hasta existir `Select`

---

## 5. Patrones de implementación

### 5.1 Página pública (referencia buena)

```tsx
// app/page.tsx — composición limpia
<Container>
  <Box display="flex" direction="col" gap="2">
    <Suspense fallback={<Spinner />}>
      <ProductsList />
    </Suspense>
  </Box>
</Container>
```

Las páginas públicas (`page.tsx`, `product/[slug]`, `contact`) siguen este patrón.

### 5.2 Campo de formulario

Patrón actual (repetido en admin):

```tsx
<Label htmlFor="nombre" display="block" spacing="sm">
  <Typography variant="body2" mb={1}>Nombre *</Typography>
  <Input id="nombre" name="nombre" required />
</Label>
```

**Regla**: no copiar este bloque más de una vez en el mismo archivo. Si se repite, extraer `FormField` o similar.

Para `<select>` nativos en admin:

```tsx
<select className={formFieldClassName} ...>
```

### 5.3 Botones CTA tienda

```tsx
<Button variant="ctaSolid" size="cta">Comprar</Button>
<Button variant="ctaOutline" size="cta">Ver más</Button>
```

### 5.4 Panel admin

- Estilos interactivos: `adminNavLinkClassName`, `adminMenuOptionClassName`, `adminIconTriggerClassName`, `adminClearIconButtonClassName`
- Tablas y acciones: componentes `Admin*` existentes
- Estado/fetch pesado: extraer custom hooks (`useAdminProducts`, etc.)

---

## 6. Checklist para agentes de IA

Antes de entregar código UI:

- [ ] ¿Existe un componente en `components/ui/` que resuelva esto?
- [ ] ¿Puedo usar `Typography` en lugar de etiquetas con clases?
- [ ] ¿Puedo usar `Box`/`Div` en lugar de `<div className="flex gap-4…">`?
- [ ] ¿El botón es `Button` con variante existente?
- [ ] ¿Los colores usan tokens CSS (`text-muted-foreground`, `bg-primary`) y no hex sueltos?
- [ ] ¿El z-index viene de `design-tokens`?
- [ ] ¿Evité crear CSS nuevo fuera de `globals.css`?
- [ ] ¿El diff es el mínimo necesario?
- [ ] ¿Separé lógica (hooks) de presentación en páginas grandes?

---

## 7. Revisión del estado actual del código

### 7.1 Lo que está bien

- Base sólida de primitivos en `components/ui/`
- `cn()`, CVA en Button, sistema tipográfico con `Typography`
- Layout declarativo con `Container`, `Box`, `Div`
- Tokens de color centralizados en `globals.css`
- Estilos admin centralizados en `admin-interactive-styles.ts`
- Páginas públicas bien componetizadas
- Un solo archivo CSS (`globals.css`)
- Separación clara admin (`Admin*`) vs tienda pública

### 7.2 Deuda técnica y mejoras sugeridas

| Prioridad | Problema | Archivos afectados | Acción sugerida |
|-----------|----------|-------------------|-----------------|
| Alta | Páginas admin monolíticas (470–760 líneas) | `products/page.tsx`, `sales/page.tsx`, `users/page.tsx` | Extraer hooks de estado/fetch y subcomponentes de modales |
| Alta | Sin componente `Select` | 7+ archivos con `<select className={formFieldClassName}>` | Crear `components/ui/Select.tsx` basado en `formFieldClassName` |
| Media | Bloque Label+Typography+Input repetido ~50 veces | Forms admin, login, onboarding | Crear `FormField` compuesto |
| Media | Overlays mobile duplicados | `MobileMenu.tsx`, `MobileSearch.tsx` | Extraer `MobileOverlay` / `MobilePanel` |
| Media | z-index inconsistente | `Spinner`, `MobileMenu`, `ProductImageGallery` | Migrar a `design-tokens.zIndex` |
| Media | Botón clear de búsqueda duplicado | `SearchInput.tsx` vs `adminClearIconButtonClassName` | Unificar en utilidad o `InputAdornment` |
| Baja | Links sociales duplicados | `Footer.tsx`, `contact/page.tsx` | Extraer `SocialIconLink` |
| Baja | `design-tokens.ts` parcialmente huérfano | Solo `zIndex` se usa | Adoptar o podar exports no usados |
| Baja | `Paragraph.tsx` redundante | Solo usado en `ProductsList` | Migrar a `Typography` y eliminar |
| Baja | Fuente heading hardcodeada | `NavLink.tsx`, `ProductFeatureHighlights.tsx` | Usar `Typography` o variante con font heading |
| Baja | Modales de confirmación repetidos | pages admin de products/sales/users | Extraer `ConfirmDeleteModal` genérico |
| Info | `NavLink` vs `AdminNavLink` | Nombres similares, dominios distintos | Documentado; no unificar |

### 7.3 Veredicto

**El proyecto va bien encaminado.** La tienda pública y la capa de primitivos UI están ordenadas. Los principales gaps están en el panel admin (páginas muy grandes, selects nativos sin componente, boilerplate de formularios) y en pequeñas duplicaciones de overlays/links. Nada crítico que impida seguir desarrollando; conviene abordar la deuda de forma incremental.

---

## 8. Ejemplos: qué hacer y qué no

### Correcto — extender existente

```tsx
// Ajuste puntual con prop className sobre Typography
<Typography variant="h1" className="text-2xl sm:text-4xl">
  Contacto
</Typography>
```

### Incorrecto — reinventar tipografía

```tsx
// ❌ No hacer esto en páginas
<h1 className="text-4xl font-bold [font-family:var(--font-archivo-black)]">
  Contacto
</h1>
```

### Correcto — layout declarativo

```tsx
<Box display="flex" justify="between" align="center" gap="4" className="flex-wrap">
```

### Incorrecto — div con muchas clases en página

```tsx
// ❌ Evitar en page.tsx si Box/Div lo resuelven
<div className="flex items-center justify-between flex-wrap gap-4">
```

### Correcto — admin interactivo

```tsx
import { adminClearIconButtonClassName } from "@/lib/admin-interactive-styles";

<button type="button" className={adminClearIconButtonClassName} aria-label="Limpiar">
```

---

## 9. Integración con Cursor

El archivo `.cursor/rules/estandarizacion-ui.mdc` aplica estas reglas automáticamente en cada sesión (`alwaysApply: true`).

Para otras herramientas de IA, incluir este documento como contexto o referencia en el system prompt del proyecto.

---

*Última revisión: junio 2026*
