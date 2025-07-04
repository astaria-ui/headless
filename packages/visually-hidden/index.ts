// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import VisuallyHidden, {
  type VisuallyHiddenProps,
} from "./src/VisuallyHidden.astro";

const AVisuallyHidden = VisuallyHidden;
type AVisuallyHiddenProps = VisuallyHiddenProps;

export { AVisuallyHidden, type AVisuallyHiddenProps };
