export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
    </header>
  );
}
