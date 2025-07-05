// packages/focus-scope/src/lib/FocusScopeRoot.script.ts

type FocusableTarget = HTMLElement & { focus: () => void };

class AstariaFocusScopeRoot extends HTMLElement {
  #loop: boolean = false;
  #trapped: boolean = false;
  #paused: boolean = false;
  #shadowDom: ShadowRoot;
  #firstElement: HTMLElement | null = null;
  #lastElement: HTMLElement | null = null;
  #lastFocusedElement: HTMLElement | null = null;
  #container: HTMLElement | null = null;
  #mutationObserver: MutationObserver | null = null;

  #boundHandleFocusIn: (event: FocusEvent) => void;
  #boundHandleFocusOut: (event: FocusEvent) => void;
  #boundHandleKeyDown: (event: KeyboardEvent) => void;
  #boundMutationsCallback: (mutations: MutationRecord[]) => void;

  constructor() {
    super();
    this.#shadowDom = this.attachShadow({ mode: "open" });
    this.#shadowDom.innerHTML = `<slot part="astaria-focus-scope-root-slot"></slot>`;
    if (this.childElementCount > 1) {
      console.error(
        "Only one element should be the child of FocusScopeContainer"
      );
      return;
    }

    this.#container = this.children.item(0) as HTMLElement | null;

    if (this.children) {
      this.#firstElement = this.children.item(0) as HTMLElement | null;
      this.#lastElement = this.children.item(-1) as HTMLElement | null;
    }
    this.#boundHandleFocusIn = this.#handleFocusIn.bind(this);
    this.#boundHandleFocusOut = this.#handleFocusOut.bind(this);
    this.#boundMutationsCallback = this.#handleMutations.bind(this);
  }

  connectedCallback() {
    document.addEventListener("focusin", this.#boundHandleFocusIn);
    document.addEventListener("focusout", this.#boundHandleFocusOut);

    this.#mutationObserver = new MutationObserver(this.#boundMutationsCallback);
    if (!this.#container) {
      console.error("No Container found for Focus Scope");
      return;
    }
    this.#mutationObserver.observe(this.#container, {
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    document.removeEventListener("focusin", this.#boundHandleFocusIn);
    document.removeEventListener("focusout", this.#boundHandleFocusOut);
    this.#mutationObserver?.disconnect();
  }

  #handleFocusIn(event: FocusEvent) {
    if (this.#trapped) {
      if (this.#paused || !this.#container) return;
      const target = event.target as HTMLElement | null;
      if (this.#container.contains(target)) {
        this.#lastFocusedElement = target;
      } else {
        this.#focusElement(this.#lastFocusedElement, { select: true });
      }
    }
  }

  #focusElement(element?: FocusableTarget | null, { select = false } = {}) {
    // only focus if that element is focusable
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement;
      // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
      element.focus({ preventScroll: true });
      // only select if its not the same element, it supports selection and we need to select
      if (
        element !== previouslyFocusedElement &&
        this.#isSelectableInput(element) &&
        select
      )
        element.select();
    }
  }

  #isSelectableInput(
    element: any
  ): element is FocusableTarget & { select: () => void } {
    return element instanceof HTMLInputElement && "select" in element;
  }

  #handleFocusOut(event: FocusEvent) {
    if (this.#paused || !this.#container) return;
    const relatedTarget = event.relatedTarget;

    // A `focusout` event with a `null` `relatedTarget` will happen in at least two cases:
    //
    // 1. When the user switches app/tabs/windows/the browser itself loses focus.
    // 2. In Google Chrome, when the focused element is removed from the DOM.
    //
    // We let the browser do its thing here because:
    //
    // 1. The browser already keeps a memory of what's focused for when the page gets refocused.
    // 2. In Google Chrome, if we try to focus the deleted focused element (as per below), it
    //    throws the CPU to 100%, so we avoid doing anything for this reason here too.

    if (relatedTarget === null) {
      return;
    }

    if (!this.#container.contains(relatedTarget as Node)) {
      this.#focusElement(this.#lastFocusedElement, { select: true });
    }
  }

  // When the focused element gets removed from the DOM, browsers move focus
  // back to the document.body. In this case, we move focus to the container
  // to keep focus trapped correctly.

  #handleMutations(mutations: MutationRecord[]) {
    const focusedElement = document.activeElement as HTMLElement | null;
    if (focusedElement !== document.body) return;
    for (const mutation of mutations) {
      if (mutation.removedNodes.length > 0) this.#focusElement(this);
    }
  }
}

if (!customElements.get("astaria-focus-scope-root")) {
  customElements.define("astaria-focus-scope-root", AstariaFocusScopeRoot);
}
