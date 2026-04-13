import Link from "next/link";

type ReviewCardPlaceholderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewCardPlaceholderPage({
  params,
}: ReviewCardPlaceholderPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 py-4">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back
      </Link>

      <section className="rounded-xl border bg-card px-6 py-8 text-card-foreground">
        <p className="text-sm text-muted-foreground">Review mode</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Coming in ticket 008
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          This temporary route exists so the home page card grid can navigate to
          a valid destination before the full review experience is implemented.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Selected card ID:{" "}
          <span className="font-mono text-foreground">{id}</span>
        </p>
      </section>
    </div>
  );
}
