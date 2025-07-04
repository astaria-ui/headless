import { AvatarAttributes } from "../constants/attributes";
import { AvatarEvent } from "../constants/event";
import { AvatarComponentNames } from "../constants/names";
import type { ImageLoadingStatus } from "../utils/imageLoadingStatus";

export class AstariaAvatarRoot extends HTMLElement {
  #imageLoadingStatus: ImageLoadingStatus = "idle";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<slot part="root-slot"></slot>`;
    }
  }

  connectedCallback() {
    // Listen for custom events from child MyAvatarImage
    this.addEventListener(
      AvatarEvent.ImageLoadingStatusChange,
      this.#handleImageStatusChange as EventListener
    );
    this.#dispatchStatusUpdate(); // Dispatch initial state for any connected children
  }

  disconnectedCallback() {
    this.removeEventListener(
      AvatarEvent.ImageLoadingStatusChange,
      this.#handleImageStatusChange as EventListener
    );
  }

  #handleImageStatusChange(event: CustomEvent<{ status: ImageLoadingStatus }>) {
    const newStatus = event.detail.status;
    if (this.#imageLoadingStatus !== newStatus) {
      this.#imageLoadingStatus = newStatus;
      this.setAttribute(AvatarAttributes.ImageStatus, newStatus);
      this.#dispatchStatusUpdate();
    }
  }

  #dispatchStatusUpdate() {
    this.dispatchEvent(
      new CustomEvent(AvatarEvent.RootStatusUpdate, {
        bubbles: true,
        composed: true,
        detail: {
          imageLoadingStatus: this.#imageLoadingStatus,
        },
      })
    );
  }

  get imageLoadingStatus(): ImageLoadingStatus {
    return this.#imageLoadingStatus;
  }
}

if (!customElements.get(AvatarComponentNames.AvatarRoot)) {
  customElements.define(AvatarComponentNames.AvatarRoot, AstariaAvatarRoot);
}
