// src/announcement.jsx

import { h } from './h';

export function announcement(message) {
    return <div class="banner">{message}</div>
}

/* The code above is a lot easier to understand and work with as opposed to

export function announcement(message) {
    // Safe DOM building
    const el = document.createElement('div');
    el.classList.add('banner');
 // el.addAttribute('class', 'banner'); // another way to add the class
    const text = document.createTextNode(message);
    el.appendChild(text);

    return el;
}

*/
