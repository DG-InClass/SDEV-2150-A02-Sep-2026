import Header from './components/Header';
import Filters from './components/Filters';
import Results from './components/Results';

import './App.css'

function App() {
  const rebranding = "New and Improved NAIT Resource Directory 💫";

  return (
    <>
      <Header tagline="Find the right resources, right away" heading={rebranding} />
      <hr />
      <div className='grid grid-cols-3 gap-4'>
        <Filters />
        <Results />
        {/* Put your Details component here */}
      </div>
    </>
  )
}

export default App
