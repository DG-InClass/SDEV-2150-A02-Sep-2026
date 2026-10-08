// frontend/src/components/layout/PageLayout.jsx

export default function PageLayout({ header, left, middle, right}) {
    return <div className="min-h-screen">
        <header className="border-b bg-white px-4 py-4">
            {header}
        </header>

        <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-6 md:grid-cols-4">
            <aside>{left}</aside>
            <section className="md:col-span-2">{middle}</section>
            <aside>{right}</aside>
        </main>
    </div>
}