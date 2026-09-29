// src/h.js
// This is our "factory function" that will be used by Oxc
// - "Transpilation" is kind of like "compiling for JavaScript/TypeScript"
// - It's like a pre-processing of the .jsx files to generate regular
//   JavaScript

/**
 * 
 * @param {String} tag - The tag name for the element
 * @param {Object} props - An object containing any attributes for our tag
 * @param  {...any} children - Any "nested" tags
 * @returns 
 */
export function h(tag, props, ...children) {
    const element = document.createElement(tag);
    // <button class="btn" onclick={() => console.log('clicked')}>
    //         \_________/ \________ event handler _____________/
    //     attribute |
    const properties = Object.entries(props ?? {});

    for (const [name, value] of properties) {
        if (name.startsWith('on') && typeof value === 'function') {
            const eventName = name.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(name, value);
        }
    }

    // Append all the nested elements in my tag
    element.append(...children.flat());

    return element;
}
