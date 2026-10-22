import { useEffect, useState } from 'react';
/* Many applications use the built-in "database" storage mechanisms available in
    almost every browser. Two commonly used ones are Session Storage and Local Storage.

    - Session Storage holds key/value pairs of information for as long as the website is open in the browser. As soon as you close your browser tab, the session storage for the website is cleared/deleted.
    - Local Storage holds key/value pairs of information that persists even after you close your browser tab.

    Some common uses of session storage is remembering your login token.
    A common use of local storage might be something like remembering your preferred theme.
*/

const STORAGE_KEY = 'selectedResource';

export function useSelectedResource() {
  const [selectedResource, setSelectedResource] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    
    return null;
  });

  useEffect(() => {
    // Updating the stored value
    try {
      if (selectedResource === null) {
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedResource));
      }
    } catch (error) {
      console.warn('Selection could not be saved for this tab', error);
    }
  }, [selectedResource]); // This effect depends on my React useState() data

  // function updateSelectedResource(resource) {
  //   setSelectedResource(resource);

  //   if (resource === null) {
  //     sessionStorage.removeItem(STORAGE_KEY);
  //   } else {
  //     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resource));
  //   }
  // }

  return [selectedResource, setSelectedResource];
}
