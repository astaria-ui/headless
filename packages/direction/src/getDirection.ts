export function getDirection(): "rtl" | "ltr" {
  if (typeof window === "undefined") {
    return "ltr";
  }

  return window.layout?.dir || "ltr";
}
