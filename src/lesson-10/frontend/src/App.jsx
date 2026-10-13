import Header from './components/Header';
import Filters from './components/Filters';
import Results from './components/Results';
import Details from './components/Details';
import PageLayout from './components/layout/PageLayout';

function App() {
  return (
    <PageLayout header={<Header tagline="Find the right resources, right away" />}>
      <div className="md:col-span-3 lg:col-span-1">
        <Filters />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <Results />
      </div>

      <div className="md:col-span-1">
        <Details />
      </div>
    </PageLayout>
  );
}

export default App;
