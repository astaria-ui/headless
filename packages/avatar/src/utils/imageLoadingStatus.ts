export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Manages the loading status of an HTMLImageElement.
 * Returns a cleanup function.
 */
export function monitorImageLoadingStatus(
  imgElement: HTMLImageElement,
  src: string | undefined,
  onStatusChange: (status: ImageLoadingStatus) => void,
  options?: { referrerPolicy?: ReferrerPolicy; crossOrigin?: string }
): () => void {
  if (options?.referrerPolicy) {
    imgElement.referrerPolicy = options.referrerPolicy;
  }
  if (typeof options?.crossOrigin === "string") {
    imgElement.crossOrigin = options.crossOrigin;
  }

  const resolveStatus = (): ImageLoadingStatus => {
    if (!src) return "error";
    if (imgElement.complete && imgElement.naturalWidth > 0) return "loaded";
    return "loading";
  };

  const updateStatus = (status: ImageLoadingStatus) => {
    onStatusChange(status);
  };

  const handleLoad = () => updateStatus("loaded");
  const handleError = () => updateStatus("error");

  imgElement.addEventListener("load", handleLoad);
  imgElement.addEventListener("error", handleError);

  if (src && imgElement.src !== src) {
    imgElement.src = src;
  }

  onStatusChange(resolveStatus());

  return () => {
    imgElement.removeEventListener("load", handleLoad);
    imgElement.removeEventListener("error", handleError);
  };
}
