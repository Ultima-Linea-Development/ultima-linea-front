type AdminMainContentProps = {
  children: React.ReactNode;
};

export default function AdminMainContent({ children }: AdminMainContentProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pt-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pt-6 md:pb-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-0 md:px-6">
        {children}
      </div>
    </main>
  );
}
