import { define, html } from "hybrids";

export type PlaceholderProps =
  | {
      width: number | string;
      height: number | string;
      aspectRatio?: number | string;
    }
  | {
      aspectRatio: number | string;
      width: number | string;
      height?: number | string;
    }
  | {
      aspectRatio: number | string;
      height: number | string;
      width?: number | string;
    };

export default define.compile<PlaceholderProps>({
  tag: "astaria-placeholder",
  width: undefined,
  height: undefined,
  aspectRatio: 1,
  render: ({ height, width, aspectRatio }) => {
    let calculatedWidth = width;
    let calculatedHeight = height;

    if (width && !Number.isNaN(Number(width))) {
      calculatedWidth = String(width) + "px";
    }

    if (height && !Number.isNaN(Number(height))) {
      calculatedHeight = String(height) + "px";
    }

    if (!width && height) {
      calculatedWidth = `calc(${height} * ${aspectRatio})`;
    }

    if (!height && width) {
      calculatedHeight = `calc(${width} / ${aspectRatio})`;
    }

    if (!width && !height) {
      calculatedWidth = "100%";
      calculatedHeight = "100%";
    }

    return html`<div />`.css`
      div {
        width: var(--placeholder-width, ${calculatedWidth});
        height: var(--placeholder-height, ${calculatedHeight});
        background-color: var(--placeholder-background-color, silver);
      }
    `;
  },
});
