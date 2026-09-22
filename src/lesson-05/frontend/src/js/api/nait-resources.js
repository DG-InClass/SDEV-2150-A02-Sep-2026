// js/api/nait-resources.js

// #region
/**
 * getResources() will return all the NAIT resources from the supplied URL.
 * @param {string} url - The endpoint for getting NAIT Resource information
 * @returns {Promise<Object[]>} - Parsed JSON data
 */
export function getResources(url) {
    return fetch(url).then(handleJsonResponse).catch(wrapErrors);
    // I'm using callbacks \________________/        \________/
}

export async function getResourcesAlt(url) {
    try {
        const response = await fetch(url); // await means pause
        const data = await handleJsonResponse(response);
        return data;
    } catch (error) {
        const wrap = wrapErrors(error);
        return wrap;
    }
}
// #endregion

// #region
/**
 * handleJsonResponse() is a general-purpose function to "unpack" JSON data
 * from a fetch() call.
 * 
 * @param {Response} response - The Http Response object from the fetch
 * @returns {Promise<Object | Object[]>} - A JavaScript object/array from the parsed JSON
 */
function handleJsonResponse(response) {
    // Checking if the response is good to work with
    if (!response.ok) {
        // Report that we had a problem - non-2xx response
        throw new Error(`Network response was not ok: (${response.status}) ${response.statusText}`);
    }
    // Check that the info we got is actually JSON
    const contentType = response.headers.get('content type');
    if(!contentType || !contentType.includes('application/json')) {
        // We've received something other than JSON
        throw new Error(`Response is not JSON: ${contentType}`);
    }

    // .json() will "unpack"/"parse" the JSON into JavaScript object/arrays
    return response.json(); // returns a promise of some JavaScript data
}

/**
 * wrapErrors() will take the error details and "wrap" it in a general error message.
 * @param {Error} error - Details on what went wrong
 * @returns {Promise<Error>} - A "wrapped" error.
 */
function wrapErrors(error) {
    const wrapped = new Error('Unable to complete data request', { cause: error?.cause});
    return new Promise(wrapped);
}
// #endregion
