// frontend/src/components/ResultsItem.jsx
import './ResultsItem.module.css';

// React components have two special property names (props):
// - key - often used when mapping multiple instances of a component
// - children - used for nested child components of this component
export default function ResultsItem({ key, title, category, summary, location, children }) {
    return <li key={key}>
              <div>
                <h2>{title}</h2>
                {children}
                <small>{category}</small>
              </div>
              <p>{summary}</p>
              <small>
                {location}
              </small>
            </li>
}
