// my-hybrids-ui-library/src/components/Placeholder.ts

import { define, html } from "hybrids";

type Dimension = number | string | undefined;

function calculateDimension(
  calculatedDimension: Dimension
): string | undefined {
  if (typeof calculatedDimension === "number") {
    return `${calculatedDimension}px`;
  } else if (
    typeof calculatedDimension === "string" &&
    !/(\%|px|rem|em|vw|vh)$/.test(calculatedDimension)
  ) {
    return `${calculatedDimension}px`;
  }
  return calculatedDimension;
}

export type PlaceholderProps = {
  pulse?: boolean;
} & (
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
    }
);

export default define.compile<PlaceholderProps>({
  tag: "astaria-placeholder",
  width: undefined,
  height: undefined,
  aspectRatio: 1,
  pulse: false,
  render: ({ pulse, width, height, aspectRatio }) => {
    let calculatedWidth = width;
    let calculatedHeight = height;
    const calcAspectRatio = Number(aspectRatio);

    calculatedWidth = calculateDimension(calculatedWidth);
    calculatedHeight = calculateDimension(calculatedHeight);

    if (
      !calculatedHeight &&
      calculatedWidth &&
      !Number.isNaN(calcAspectRatio) &&
      calcAspectRatio !== 0
    ) {
      calculatedHeight = `calc(${calculatedWidth} / ${calcAspectRatio})`;
    } else if (
      !calculatedWidth &&
      calculatedHeight &&
      !isNaN(calcAspectRatio) &&
      calcAspectRatio !== 0
    ) {
      calculatedWidth = `calc(${calculatedHeight} * ${calcAspectRatio})`;
    } else if (!calculatedWidth && !calculatedHeight) {
      calculatedWidth = "100%";
      calculatedHeight = "100%";
    }

    const pulseClass = pulse ? "pulse-animation" : "";

    return html`<div part="container" class="${pulseClass}"></div>`.css`
      :host {
        --astaria-placeholder-width: ${calculatedWidth};
        --astaria-placeholder-height: ${calculatedHeight};
        display: inline-block;
      }

      div {
        width: var(--astaria-placeholder-width);
        height: var(--astaria-placeholder-height);
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }

      .pulse-animation {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
  },
});
