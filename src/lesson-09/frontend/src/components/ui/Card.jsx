// frontend/src/components/ui/Card.jsx

export default function Card({ title, pillText, children }) {
    return <section className="h-full rounded border border-gray-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="leading-relaxed font-bold text-sm text-gray-900">
                {title}
            </h2>
            {
                pillText &&
                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                    {pillText}
                </span>
            }
        </header>
        <div>
            {children}
        </div>
    </section>
}
