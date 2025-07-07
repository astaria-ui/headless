import { define, html, type Component } from "hybrids";

export interface AspectRatioProps extends HTMLElement {
  ratio: number;
}

export const AspectRatio: Component<AspectRatioProps> = {
  tag: "astaria-aspect-ratio",
  ratio: 1,
  render: ({ ratio }) =>
    html`<slot />`
      .css`:host{display:block;aspect-ratio:${ratio};width:100%;}:host([data-display-contents]){display:content;}`,
};

export const AspectRatioHybrid = define(AspectRatio);
export const AspectRatioCompiled = define.compile(AspectRatio);
