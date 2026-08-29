import { requireSession } from "@/lib/auth-helpers";
import { AppHeader } from "@/components/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader
        displayName={session.user.displayName}
        isAdmin={session.user.role === "ADMIN"}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
