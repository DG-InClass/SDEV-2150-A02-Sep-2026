export default function Card({ title, children }) {
  return (
    <section className="card h-full border border-base-300 bg-base-100 text-base-content shadow-sm">
      <header className="border-b border-base-300 px-4 py-3">
        <h2 className="card-title text-sm">{title}</h2>
      </header>
      <div>
        {children}
      </div>
    </section>
  );
}