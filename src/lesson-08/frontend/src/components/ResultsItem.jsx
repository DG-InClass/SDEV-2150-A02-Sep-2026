// frontend/src/components/ResultsItem.jsx

// React components have two special property names (props):
// - key - often used when mapping multiple instances of a component
// - children - used for nested child components of this component
export default function ResultsItem({ key, title, category, summary, location, children }) {
    return <li
              key={key}
              className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold">{title}</h2>
                {children}
                <small className="text-xs text-gray-500">{category}</small>
              </div>
              <p className="mt-1 text-xs text-gray-500">{summary}</p>
              <small className="mt-1 block text-xs text-gray-500">
                {location}
              </small>
            </li>
}