import type { AstariaAvatarRoot } from "./AvatarRoot.script";
import { AvatarAttributes } from "../constants/attributes";
import { AvatarEvent } from "../constants/event";
import { AvatarComponentNames } from "../constants/names";
import type { ImageLoadingStatus } from "../utils/imageLoadingStatus";

export class AstariaAvatarFallback extends HTMLElement {
  #rootStatusUpdateHandler: ((event: Event) => void) | null = null;
  #currentImageStatus: ImageLoadingStatus = "idle";
  #shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "astaria-avatar-fallback-template"
    ) as HTMLTemplateElement;

    if (template) {
      this.#shadowRoot.appendChild(template.content.cloneNode(true));
    }

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
  }

  disconnectedCallback() {
    if (this.#rootStatusUpdateHandler) {
      this.closest(AvatarComponentNames.AvatarRoot)?.removeEventListener(
        AvatarEvent.RootStatusUpdate,
        this.#rootStatusUpdateHandler
      );
      this.#rootStatusUpdateHandler = null;
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

  #evaluateVisibility() {
    const shouldShow = this.#currentImageStatus !== "loaded";
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
