const template = document.createElement('template');
// TODO: Update the template to support dynamic resource details
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <section class="h-100">
    <div class="card h-100">
      <div class="card-header">
        <strong>Details</strong>
      </div>

      <!-- Details content will be injected here -->
      <slot></slot>

      <!-- Action buttons may be dealt with in the future... -->
      <div class="card-footer d-flex gap-2">
        <button class="btn btn-outline-secondary" type="button">Copy email</button>
        <button class="btn btn-outline-primary" type="button">Open map</button>
      </div>
    </div>
  </section>`;

class ResourceDetails extends HTMLElement {
  // TODO: Create private field for resource data
  #resource = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  // TODO: Implement setter for resource data, remember to render
  set resource(data) {
    this.#resource = data;
    this.render();
  }

  render() {
    // TODO: Render resource details if available
    this.shadowRoot.innerHTML = ''; // Clear the contents (for re-painting)
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    if (this.#resource) {
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('card-body');
      const { title, summary, category, location, hours, contact } = this.#resource; // Object destructuring syntax
      detailsContainer.innerHTML = `
        <h2 class="h5">${title}</h2>
        <p class="text-body-secondary mb-2">${summary}</p>

        <dl class="row mb-0">
          <dt class="col-4">Category</dt>
          <dd class="col-8">${category}</dd>
          
          <dt class="col-4">Location</dt>
          <dd class="col-8">${location}</dd>
          
          <dt class="col-4">Hours</dt>
          <dd class="col-8">${hours}</dd>
          
          <dt class="col-4">Contact</dt>
          <dd class="col-8">${contact}</dd>
        </dl>
      `;
      this.shadowRoot.querySelector('slot').appendChild(detailsContainer);
    }
  }
}

customElements.define('resource-details', ResourceDetails);