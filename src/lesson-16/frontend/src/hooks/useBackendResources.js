// lesson-16/frontend/src/hooks/useBackendResources.js
/* We'll introduce two concepts:
    - React's useEffect() Hook
        The useEffect() hook in React is there because our components sometimes depend on things "outside" of our app (such as a backend server where we fetch data).
    - Custom Hooks
        These are our opportunities to write more complex functions/code that needs to hook into React's rendering responsibilities. We typically make these because our code is getting long.
        Custom hook function names should start with `use`.
 */

import { useEffect, useState } from "react";

// URLs used for fetching the API endpoints
const API_BASE_URL = 'http://localhost:3000';
const API_GET_RESOURCES = `${API_BASE_URL}/resources`;
const TIMEOUT_MS = 5000;

export function useBackendResources() {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // we haven't gotten the data
    const [error, setError] = useState(null);

    useEffect(() => {
        // The controller lets our cleanup function cancel the request (e.g. on unmount)
        const controller = new AbortController();
        // Cancel if WE abort it, OR if the server takes too long
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(TIMEOUT_MS)]);

        console.log('effect: fetch started');

        fetch(API_GET_RESOURCES, { signal })
            .catch((err) => {
                // fetch() only rejects when no response arrived at all
                if (err.name === 'TimeoutError') {
                    throw new Error('The server took too long to respond.', { cause: err });
                }
                throw new Error('Could not reach the server. Is the backend running?', { cause: err });
            })
            .then((response) => {
                // validation
                if (!response.ok){
                    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Server did not return a JSON payload. ${contentType}`);
                }
                return response.json(); // TODO: validate content-type
            })
            .then((data) => {
                if (!Array.isArray(data)) {
                    throw new Error('Expected an array of NAIT resources');
                }
                console.log('data arrived');
                setResources(data);
                setIsLoading(false);
            })
            .catch((err) => {
                if (controller.signal.aborted) {
                    // We cancelled it on purpose, so it's not an error to show user
                    console.log('request was cancelled (ignored)');
                    return;
                }
                setError(err.message);
                setIsLoading(false);
                console.error(err); // echo the error to the browser console
            });

        // Cleanup: runs when the component unmounts (or before the effect re-runs)
        return () => {
            console.log('cleanup: aborting');
        };
    }, []);

    return { resources, isLoading, error };
}
