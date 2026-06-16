import {
  ADMIN_MAIN_CONTENT_CLASS,
  ADMIN_MAIN_CONTENT_INNER_CLASS,
} from "@/lib/admin-layout-styles";

type AdminMainContentProps = {
  children: React.ReactNode;
};

export default function AdminMainContent({ children }: AdminMainContentProps) {
  return (
    <main className={ADMIN_MAIN_CONTENT_CLASS}>
      <div className={ADMIN_MAIN_CONTENT_INNER_CLASS}>{children}</div>
    </main>
  );
}
