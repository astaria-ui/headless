import { define, html, type Component } from "hybrids";

export interface DirectionProviderProps {
  direction: "ltr" | "rtl";
}

export const DirectionProvider: Component<DirectionProviderProps> = {
  tag: "astaria-direction-provider",
  direction: "ltr",
  render: () => html`<slot></slot>`,
};

export const DirectionProviderHybrid = define(DirectionProvider);
export const DirectionProviderCompiled = define.compile(DirectionProvider);
