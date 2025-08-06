export function Footer() {
  return (
    <footer className="py-4 px-4 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-2 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Subscription Streamliner.
        </p>
      </div>
    </footer>
  );
}
