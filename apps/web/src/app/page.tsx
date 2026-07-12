import { Button, PageHeader } from "@cimena/ui";
import { HealthStatusPanel } from "@/components/health-status";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Application Foundation"
        description="A generic customer-facing shell connected to the shared UI package and FastAPI health endpoint."
      />
      <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">
            Ready for incremental features
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This first screen is intentionally generic. It verifies styling,
            shared components, providers, and API connectivity without
            introducing business-specific concepts.
          </p>
          <div className="mt-6">
            <Button>Shared UI button</Button>
          </div>
        </div>
        <HealthStatusPanel />
      </section>
    </main>
  );
}
