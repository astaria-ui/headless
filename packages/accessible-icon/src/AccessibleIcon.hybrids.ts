import { define, html, type Component } from "hybrids";

export interface AccessibleIconProps extends HTMLElement {}

export const AccessibleIcon: Component<AccessibleIconProps> = {
  tag: "astaria-accessible-icon",
  render: () => html`<slot aria-hidden="true" tabindex="-1"></slot>`,
};

export const AccessibleIconHybrid = define(AccessibleIcon);
export const AccessibleIconCompiled = define.compile(AccessibleIcon);
