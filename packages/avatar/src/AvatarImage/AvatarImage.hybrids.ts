import { define, html, type Component } from "hybrids";
import type { ImageLoadingStatus } from "../types";

export type AvatarImageProps = {
  dataImageStatus: ImageLoadingStatus;
  dataLoaded: boolean;
  src?: string;
  alt?: string;
  render: () => AvatarImageProps;
  img: HTMLImageElement;
} & HTMLElement;

const handleOnLoad = (host: AvatarImageProps) => {
  host.dataImageStatus = "loaded";
};

const handleOnError = (host: AvatarImageProps) => {
  host.dataImageStatus = "error";
};

export const AvatarImage: Component<AvatarImageProps> = {
  tag: "astaria-avatar-image",
  dataImageStatus: {
    value: ({ src, img }, value) => {
      if (!src) return "error";
      if (!img) return "idle";
      if (!img.complete && img.naturalWidth === 0) return "loading";
      return value;
    },
    reflect: true,
  },
  dataLoaded: {
    value: ({ src, img }, value) => {
      if (!src || !img || (!img.complete && img.naturalWidth === 0))
        return false;
      return value;
    },
    reflect: true,
  },
  src: undefined,
  alt: undefined,
  img: {
    value: ({ render }) => render().querySelector("img") as HTMLImageElement,
    connect(host, key, invalidate) {
      if (host[key] !== undefined) invalidate();
    },
  },
  render: ({ src, alt }) => {
    return html`
    <img part="img" onload="${handleOnLoad}" onerror="${handleOnError}" src="${src}" alt="${alt}"></img>`
      .css`
        :host {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            transition: opacity 200ms ease-in-out;
        }
        :host::part(img) {
          width: 100%;
          height: 100%;
        }
        :host([data-image-status="error"]), :host([data-image-status="loading"]), :host([data-image-status="idle"]) {
            opacity: 0;
        }
        :host([data-image-status="loaded"]) {
            opacity: 1;
        }
    `;
  },
};

export const AvatarImageHybrid = define<AvatarImageProps>(AvatarImage);

export const AvatarImageCompiled =
  define.compile<AvatarImageProps>(AvatarImage);
