import { define, html, type Component } from "hybrids";

export interface VisuallyHiddenProps extends HTMLElement {}

export const VisuallyHidden: Component<VisuallyHiddenProps> = {
  tag: "astaria-visually-hidden",
  render: () =>
    html`<slot></slot>`
      .css`:host{position:absolute;border:0px;width:1px;height:1px;padding:0px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;word-wrap:normal;}`,
};

export const VisuallyHiddenHybrid = define(VisuallyHidden);

export const VisuallyHiddenCompiled = define.compile(VisuallyHidden);
