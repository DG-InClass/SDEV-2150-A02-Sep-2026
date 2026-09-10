// resource-filters.js
const template = document.createElement('template');
template.innerHTML = `<div>Replace Me</div>`;

class ComponentName extends HTMLElement {
    constructor() {
        // The job of the constructor is to ensure
        // that all the properties have meaningful
        // values.
        super(); // call the constructor of the class we are inheriting
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        // our opportunity to do whatever "initialization"
        this.render();
    }

    render() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('component-name', ComponentName);
