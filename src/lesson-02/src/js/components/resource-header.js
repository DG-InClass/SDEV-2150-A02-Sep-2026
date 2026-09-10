// resource-header.js
const template = document.createElement('template');
template.innerHTML = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <header class="mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-2">
        <div>
          <h1 class="h3 mb-1">NAIT Resource Directory</h1>
          <p class="text-body-secondary mb-0">
            Find student support services, labs, and campus resources.
          </p>
        </div>
      </div>
    </header>
`;

class ResourceHeader extends HTMLElement {
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

customElements.define('resource-header', ResourceHeader);
