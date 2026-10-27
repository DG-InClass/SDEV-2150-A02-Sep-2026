import { Outlet } from 'react-router'; // Component to show content for the URL
import Header from './components/Header';
import PageLayout from './components/layout/PageLayout';

export default function App() {
  return (
    <PageLayout header={<Header tagline="Find the right resources, right away" />}>
      {/* React Router to "inject" the appropriate components based on the Route */}
      <Outlet />
    </PageLayout>
  );
}
