// main.js
import './components/resource-header.js';
import './components/resource-filters.js';
import './components/resource-results.js';
import './components/resource-details.js';

const resultsComponent = document.querySelector('resource-results');


// Filters emit state, main.js updates results and resets details
const filtersComponent = document.querySelector('resource-filters');
filtersComponent.addEventListener('resource-filters-changed', (event) => {
  resultsComponent.filters = event.detail;
  const detailsComponent = document.querySelector('resource-details');
  // Reset details when filter state changes to avoid stale selection.
  detailsComponent.resource = null;
});

const detailsComponent = document.querySelector('resource-details');
resultsComponent.addEventListener('resource-selected', (event) => {
  const { resource } = event.detail;
  detailsComponent.resource = resource;
});

// TODO: Stage 2: Replace the app shell coordination above with a `source` attribute on <resource-results>
// so the component fetches its own data when the source changes
// Option 1: set the source attribute to a URL string hrere in code or
// Option 2: set the source attribute directly in the HTML markup (index.html)
