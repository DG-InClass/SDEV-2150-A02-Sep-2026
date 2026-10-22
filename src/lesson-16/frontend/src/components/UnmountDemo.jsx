// src/components/UnmountDemo.jsx
// Demo: cancelling a fetch when a component unmounts.
//   1. Run the backend with `pnpm run start:slow` (3 second delay)
//   2. Open DevTools: Network tab (Fetch/XHR) + Console
//   3. Click "Show", then "Hide" before the 3 seconds are up
//      -> the request shows as (canceled) and "data arrived" never logs
// Tip: temporarily remove <StrictMode> in main.jsx so the only cancel you see is the one you caused.
import { useState } from 'react';
import { useBackendResources } from '../hooks/useBackendResources';

function ResourceCount() {
  const { resources, isLoading, error } = useBackendResources();
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-error">Error: {error.message}</p>;
  return <p>Loaded {resources.length} resources.</p>;
}

export default function UnmountDemo() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-4 p-4">
      <button className="btn btn-sm" onClick={() => setShow((s) => !s)}>
        {show ? 'Hide' : 'Show'} resources
      </button>
      {show && <ResourceCount />}
    </div>
  );
}
