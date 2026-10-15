import { useState } from 'react'; // useState() is the way we inform React of the data our component is using
import Card from './ui/Card';

// src/components/Filters.jsx
export default function Filters() {
  const [searchTerm, setSearchTerm] = useState(""); // initialize the term to an empty string
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  function toggleCategory(category) {
    setSelectedCategories((previousState) => {
      if (category === 'All') return [];
      // is the category already selected?
      if (previousState.includes(category)) {
        // remove that category, because that's what toggle
        return previousState.filter((item) => item !== category);
      }
      // guess this is a new one....
      return [...previousState, category];
    });
  }

  function handleSubmit(evt) {
    // Remember to stop the form from submitting
    evt.preventDefault();
    console.log('Filters submitted', {
      searchTerm, selectedCategories, isOpenNow, isVirtual
    });
  }

  return (
    <Card title="Filters">
      <div className="space-y-4 p-4">
        <form id="frm-filter" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="q" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="q"
              type="text"
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              placeholder="Try: tutoring, mental health, bursary"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <p>Searching for {searchTerm || '(nothing yet)'}</p>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-800">Category</div>
            <div className="flex flex-wrap gap-2" aria-label="Category filters">
              {['All', 'Academic', 'Wellness', 'Financial', 'Tech'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleCategory(label)}
                  className={`btn btn-sm ${
                    (label === 'All'
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(label)
                    ) ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="openNow"
                checked={isOpenNow}
                onChange={(evt) => setIsOpenNow(evt.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              Open now
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="virtual"
                checked={isVirtual}
                onChange={(evt) => setIsVirtual(evt.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              Virtual options
            </label>
          </div>

          <hr className="border-gray-200" />

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
    </Card >
  );
}
