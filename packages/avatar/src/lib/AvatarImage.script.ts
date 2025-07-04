import { AvatarAttributes } from "../constants/attributes";
import { AvatarEvent } from "../constants/event";
import { AvatarComponentNames } from "../constants/names";
import {
  monitorImageLoadingStatus,
  type ImageLoadingStatus,
} from "../utils/imageLoadingStatus";

export class AstariaAvatarImage extends HTMLElement {
  #imgElement: HTMLImageElement;
  #cleanupMonitor: (() => void) | null = null;

  static observedAttributes = ["src", "alt", "referrerpolicy", "crossorigin"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#imgElement = new Image();

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = ``;
    }
  }

  connectedCallback() {
    this.#startMonitoring();
  }

  disconnectedCallback() {
    this.#cleanupMonitor?.();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "src" && oldValue !== newValue) {
      this.#startMonitoring();
    }

    if (
      this.#imgElement &&
      ["alt", "referrerpolicy", "crossorigin"].includes(name)
    ) {
      if (newValue !== null) {
        this.#imgElement.setAttribute(name, newValue);
      } else {
        this.#imgElement.removeAttribute(name);
      }
    }
  }

  #startMonitoring() {
    this.#cleanupMonitor?.();
    const src = this.getAttribute("src") ?? undefined;
    const referrerPolicy =
      (this.getAttribute("referrerpolicy") as ReferrerPolicy | null) ??
      undefined;
    const crossOrigin = this.getAttribute("crossorigin") ?? undefined;

    this.#cleanupMonitor = monitorImageLoadingStatus(
      this.#imgElement,
      src,
      this.#onStatusChange.bind(this),
      { referrerPolicy, crossOrigin }
    );
  }

  #onStatusChange(status: ImageLoadingStatus) {
    this.dispatchEvent(
      new CustomEvent(AvatarEvent.ImageLoadingStatusChange, {
        bubbles: true,
        composed: true,
        detail: { status },
      })
    );

    if (status === "loaded") {
      if (!this.shadowRoot?.contains(this.#imgElement)) {
        this.#imgElement.setAttribute("part", "image");
        this.shadowRoot?.appendChild(this.#imgElement);
      }
      this.setAttribute("data-loaded", "true");
    } else {
      if (this.shadowRoot?.contains(this.#imgElement)) {
        this.shadowRoot.removeChild(this.#imgElement);
      }
      this.removeAttribute("data-loaded");
    }

    this.setAttribute(AvatarAttributes.LoadingStatus, status);
  }
}

if (!customElements.get(AvatarComponentNames.AvatarImage)) {
  customElements.define(AvatarComponentNames.AvatarImage, AstariaAvatarImage);
}
