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

export function useBackendResources() {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        async function fetchResources() {
            try {
                const response = await fetch(API_GET_RESOURCES);
                // validation
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json(); // TODO: validate content-type
                if(!Array.isArray(data)) {
                    throw new Error('Expected an array of resources');
                }
                setResources(data);
            } catch (error) {
                // TODO: figure out what to do....
                console.error(error); // echo the error to the browser console
            } finally {
                // this runs whether there is an exception/error or not
            }
        }

        fetchResources();
    });

    return { resources }
}
