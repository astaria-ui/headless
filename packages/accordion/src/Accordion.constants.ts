export const ACCORDION_KEYS = [
  "Home",
  "End",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
];

export function getState(open?: boolean) {
  return open ? "open" : "closed";
}
