// frontend/src/pages/AdminPage.jsx
import Card from '../components/ui/Card';
import { useResources } from '../hooks/useResources';

export default function AdminPage() {
  const { resources, isLoading, error, refetch } = useResources();

  return (
    <div className="md:col-span-3 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Manage resources</h2>
        <p>Create a resource and check the current list.</p>
      </div>
      {isLoading ? (
        <p role="status">Loading resources...</p>
      ) : error ? (
        <div role="alert" className="alert alert-error">
          <span>{error.message}</span>
          <button type="button" className="btn btn-sm" onClick={refetch}>Try again</button>
        </div>
      ) : (
        <Card title={`Current resources (${resources.length})`}>
          <ul className="space-y-2 p-4">
            {resources.map((resource) => (
              <li key={resource.id} className="rounded border border-base-300 p-3">
                <p className="font-semibold">{resource.title}</p>
                <p className="text-sm">{resource.category}</p>
              </li>
            ))}
          </ul>
          {resources.length === 0 && <p className="p-4">No resources yet.</p>}
        </Card>
      )}
    </div>
  );
}