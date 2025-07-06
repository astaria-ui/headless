import { define, html, parent, type Component } from "hybrids";
import {
  AvatarRootHybrid,
  type AvatarRootProps,
} from "../AvatarRoot/AvatarRoot.hybrids";

export interface AvatarFallbackProps {
  dataDelayMs: number;
  root: AvatarRootProps;
  dataShow: boolean;
}

export const AvatarFallback: Component<AvatarFallbackProps> = {
  tag: "astaria-avatar-fallback",
  dataDelayMs: {
    value: 0,
    observe(host, value, lastValue) {
      console.log(value, lastValue);
    },
    reflect: true,
  },
  dataShow: {
    value: ({ root }, value) => {
      if (root.dataImageStatus === "loaded") return false;
      return value;
    },
    observe(host, value, lastValue) {
      console.log("dataShow", host, value, lastValue);
    },
    reflect: true,
  },
  root: parent(AvatarRootHybrid),
  render: ({ dataShow }) => {
    return html` <slot part="fallback" data-show="${dataShow}" /> `.css`
      :host {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
      }
    `;
  },
};

export const AvatarFallbackHybrid = define(AvatarFallback);

export const AvatarFallbackCompiled = define.compile(AvatarFallback);
