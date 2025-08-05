export function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4">
        <p className="text-sm leading-loose text-center text-muted-foreground">
          © {new Date().getFullYear()} Subscription Streamliner. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
