const PORTAL_NAME = "astaria-portal-root";

class AstariaPortalRoot extends HTMLElement {
  #shadowRoot: ShadowRoot;
  #container: Element | DocumentFragment | null = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.innerHTML = `<slot part="astaria-portal-slot"></slot>`;
  }

  static observedAttributes = ["container"];

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "container") {
      this.#container = document.querySelector(newValue || "body");
      this.#render();
    }
  }

  connectedCallback() {
    if (!this.hasAttribute("container")) {
      this.#container = globalThis?.document?.body;
    } else {
      this.#container = this.getAttribute("container")
        ? document.querySelector(this.getAttribute("container")!)
        : globalThis?.document?.body;
    }
    this.#render();
  }

  disconnectedCallback() {
    this.#unrender();
  }

  get container() {
    return this.#container;
  }

  set container(value: Element | DocumentFragment | null) {
    this.#container = value;
    this.#render();
  }

  #render() {
    if (!this.#container) {
      return;
    }

    this.#unrender();
    this.#container.appendChild(this);
  }

  #unrender() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

if (!customElements.get(PORTAL_NAME)) {
  customElements.define(PORTAL_NAME, AstariaPortalRoot);
}
