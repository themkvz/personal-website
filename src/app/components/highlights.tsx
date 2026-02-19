export function Highlights() {
  return (
    <section className="py-16">
      <h2 className="text-lg font-semibold tracking-tight">Highlights</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-3xl font-bold tracking-tight">8+</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Years of experience
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight">20+</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Projects delivered
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight">8</p>
          <p className="mt-1 text-sm text-muted-foreground">Countries served</p>
        </div>
      </div>
    </section>
  );
}
