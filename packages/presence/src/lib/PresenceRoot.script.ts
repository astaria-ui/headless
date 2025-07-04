import { PresenceComponentNames } from "../constants/names";

interface PresenceAttributes extends HTMLElement {
  present: boolean;
}

class Presence extends HTMLElement {
  static observedAttributes = ['present'];

  #present: boolean = false;
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.innerHTML = `
      <style>
        :host {
          display: contents; /* Important: Allows the host to not interfere with layout */
        }
        :host([present="false"]) {
          display: none;
        }
      </style>
      <slot></slot>
    `;
  }

  connectedCallback() {
    this.style.display = this.#present ? '' : 'none';
  }

  disconnectedCallback() {
    // Clean up any event listeners or resources
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'present') {
      this.#present = newValue !== null;
      this.style.display = this.#present ? '' : 'none';
    }
  }

  get present(): boolean {
    return this.#present;
  }

  set present(value: boolean) {
    this.#present = value;
    if (value) {
      this.setAttribute('present', 'true');
    } else {
      this.setAttribute('present', 'false');
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get(PresenceComponentNames.PresenceRoot)) {
  customElements.define(PresenceComponentNames.PresenceRoot, Presence);
}
