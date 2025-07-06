import { children, define, html, type Component } from "hybrids";
import {
  AvatarImageHybrid,
  type AvatarImageProps,
} from "../AvatarImage/AvatarImage.hybrids";
import type { ImageLoadingStatus } from "../types";

export type AvatarRootProps = {
  images: AvatarImageProps[];
  dataImageStatus: ImageLoadingStatus;
};

export const AvatarRoot: Component<AvatarRootProps> = {
  tag: "astaria-avatar-root",
  images: children(AvatarImageHybrid),
  dataImageStatus: {
    value: ({ images }) => {
      const img = images.at(0);
      if (!img) {
        console.warn(
          "Avatar Root: No Image found, Did you forget to add AvatarImage inside?"
        );
        return "error";
      }
      return img.dataImageStatus;
    },
    reflect: true,
  },
  render: () => {
    return html` <slot />`.css`
      :host {
        width: 100%;
        height: 100%;
        aspect-ratio: 1/1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        contain: paint;
        position: relative;
      }
    `;
  },
};

export const AvatarRootHybrid = define<AvatarRootProps>(AvatarRoot);
export const AvatarRootCompiled = define.compile<AvatarRootProps>(AvatarRoot);
