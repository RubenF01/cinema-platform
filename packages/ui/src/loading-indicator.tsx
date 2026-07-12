export function LoadingIndicator({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="inline-flex items-center gap-3 text-sm text-slate-600"
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
      <span>{label}</span>
    </div>
  );
}
