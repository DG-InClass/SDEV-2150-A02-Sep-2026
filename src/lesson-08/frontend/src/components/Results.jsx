// src/components/Results.jsx
import { resources } from '../data/resources';

export default function Results() {
  return (
    <section className="h-full mb-4">
      <div className="h-full rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <strong className="text-sm text-gray-900">Results</strong>
          <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
            { resources.length }
          </span>
        </div>

        <ul className="divide-y divide-gray-200">
          {/* INFO: Could just copy/paste individual buttons, but this is more maintainable */}
          { resources.map((item) => (
            <li
              key={item.title}
              className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <small className="text-xs text-gray-500">{item.category}</small>
              </div>
              <p className="mt-1 text-xs text-gray-500">{item.summary}</p>
              <small className="mt-1 block text-xs text-gray-500">
                {item.location}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}