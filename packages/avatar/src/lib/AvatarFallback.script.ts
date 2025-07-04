import type { AstariaAvatarRoot } from "./AvatarRoot.script";
import { AvatarAttributes } from "../constants/attributes";
import { AvatarEvent } from "../constants/event";
import { AvatarComponentNames } from "../constants/names";
import type { ImageLoadingStatus } from "../utils/imageLoadingStatus";

export class AstariaAvatarFallback extends HTMLElement {
  #rootStatusUpdateHandler: ((event: Event) => void) | null = null;
  #currentImageStatus: ImageLoadingStatus = "idle";
  #delayTimer: number | null = null;
  #canRenderWithDelay: boolean = false;

  static observedAttributes = ["delay-ms"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<slot part="fallback-slot"></slot>`;
    }
  }

  connectedCallback() {
    const root = this.closest(
      AvatarComponentNames.AvatarRoot
    ) as AstariaAvatarRoot | null;
    if (!root) {
      console.warn("AstariaAvatarFallback must be a child of MyAvatarRoot.");
      return;
    }
    this.#currentImageStatus = root.imageLoadingStatus;
    this.setAttribute(AvatarAttributes.ImageStatus, this.#currentImageStatus);
    this.#evaluateVisibility();

    this.#rootStatusUpdateHandler = this.#handleRootStatusUpdate.bind(this) as (
      event: Event
    ) => void;

    root.addEventListener(
      AvatarEvent.RootStatusUpdate,
      this.#rootStatusUpdateHandler!
    );

    this.#startDelayTimer();
  }

  disconnectedCallback() {
    if (this.#rootStatusUpdateHandler) {
      this.closest(AvatarComponentNames.AvatarRoot)?.removeEventListener(
        AvatarEvent.RootStatusUpdate,
        this.#rootStatusUpdateHandler
      );
      this.#rootStatusUpdateHandler = null;
    }
    this.#clearDelayTimer();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "delay-ms" && oldValue !== newValue) {
      this.#startDelayTimer();
    }
  }

  #handleRootStatusUpdate(
    event: CustomEvent<{ imageLoadingStatus: ImageLoadingStatus }>
  ) {
    const newStatus = event.detail.imageLoadingStatus;
    if (this.#currentImageStatus !== newStatus) {
      this.#currentImageStatus = newStatus;
      this.setAttribute(AvatarAttributes.ImageStatus, newStatus);
      this.#evaluateVisibility();
    }
  }

  #startDelayTimer() {
    this.#clearDelayTimer();
    const delayMs = Number.parseInt(this.getAttribute("delay-ms") || "", 10);

    if (!Number.isNaN(delayMs) && delayMs > 0) {
      this.#canRenderWithDelay = false;
      this.#delayTimer = window.setTimeout(() => {
        this.#canRenderWithDelay = true;
        this.#evaluateVisibility();
      }, delayMs);
    } else {
      this.#canRenderWithDelay = true;
      this.#evaluateVisibility();
    }
  }

  #clearDelayTimer() {
    if (this.#delayTimer !== null) {
      window.clearTimeout(this.#delayTimer);
      this.#delayTimer = null;
    }
  }

  #evaluateVisibility() {
    const shouldShow =
      this.#canRenderWithDelay && this.#currentImageStatus !== "loaded";
    if (shouldShow) {
      this.setAttribute(AvatarAttributes.FallbackShow, "true");
    } else {
      this.removeAttribute(AvatarAttributes.FallbackShow);
    }
  }
}

if (!customElements.get(AvatarComponentNames.AvatarFallback)) {
  customElements.define(
    AvatarComponentNames.AvatarFallback,
    AstariaAvatarFallback
  );
}
