import { fontVariable } from "@/lib/fonts";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${fontVariable} h-screen antialiased overflow-hidden`}>
      {children}
    </div>
  );
}
