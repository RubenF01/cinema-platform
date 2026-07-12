import { PageHeader } from "@cimena/ui";
import { HealthStatusPanel } from "@/components/health-status";

export default function AdminHomePage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-6 lg:border-b-0 lg:border-r">
        <div className="text-sm font-semibold uppercase tracking-normal text-slate-500">
          Admin
        </div>
        <nav className="mt-6 space-y-2 text-sm text-slate-700">
          <div className="rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-950">
            Dashboard
          </div>
          <div className="px-3 py-2">Placeholder</div>
        </nav>
      </aside>
      <section className="flex flex-col gap-8 px-6 py-10">
        <PageHeader
          title="Admin Dashboard"
          description="A generic administration shell with shared components and backend health visibility."
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">
              Workspace placeholder
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This area is reserved for future administration workflows. No
              roles, permissions, or domain navigation are implemented yet.
            </p>
          </div>
          <HealthStatusPanel />
        </div>
      </section>
    </main>
  );
}
