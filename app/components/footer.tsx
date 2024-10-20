export function Footer() {
  const today = new Date();
  return (
    <footer className="z-10 flex w-full flex-col items-center justify-center gap-8 py-6">
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60">
          &copy; {today.getFullYear()} &nbsp;
          <a
            href="https://mypoplyrics.pages.dev"
            rel="noreferrer"
            className="flex items-center text-primary hover:text-primary hover:underline"
          >
            mypoplyrics.pages.dev
          </a>
        </p>
      </div>
    </footer>
  );
}
