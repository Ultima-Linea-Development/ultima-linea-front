type AdminMainContentProps = {
  children: React.ReactNode;
};

export default function AdminMainContent({ children }: AdminMainContentProps) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  );
}
