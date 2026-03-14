export function Header({ title, children }) {
  return (
    <header className="page-header">
      <h2>{title}</h2>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
