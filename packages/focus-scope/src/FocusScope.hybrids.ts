import {
  children,
  define,
  html,
  type Component,
  type Descriptor,
} from "hybrids";

export interface FocusScopeProps extends Omit<HTMLElement, "children"> {
  loop: boolean;
  trapped: boolean;
  childs: Element[];
}

const handleFocusIn = (e: FocusEvent) => {};

export const FocusScope: Component<FocusScopeProps> = {
  tag: "astaria-focus-scope",
  loop: false,
  trapped: false,
  childs: children(() => true) as Descriptor<FocusScopeProps, Element[]>,
  render: {
    value: () => html`<slot></slot>`,
    connect(host, key, invalidate) {
      if (host.trapped) {
        document.addEventListener("focusin", handleFocusIn.bind(host));
      }
      console.log({ children: host.childs });
      return () => {};
    },
  },
};

export const FocusScopeHybrid = define(FocusScope);

export const FocusScopeCompiled = define.compile(FocusScope);
