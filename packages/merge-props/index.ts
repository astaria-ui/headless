type ClassListInput =
  | string
  | Record<string, boolean>
  | Record<any, any>
  | Iterable<string>
  | Iterable<any>
  | undefined;

function normalizeClassList(input: ClassListInput): (string | Record<string, boolean>)[] {
  if (typeof input === 'string') {
    return input.split(' ').filter(Boolean);
  }
  if (Array.isArray(input)) {
    return input.flatMap(item => normalizeClassList(item));
  }
  if (typeof input === 'object' && input !== null) {
    if (Symbol.iterator in input) {
      // Handle Iterable<string> or Iterable<any>
      return Array.from(input as Iterable<any>).flatMap(item => normalizeClassList(item));
    }
    // Handle Record<string, boolean> or Record<any, any>
    return [input as Record<string, boolean>];
  }
  return [];
}

export function mergeClassList(
  existingClassList: ClassListInput,
  newClass: ClassListInput
): (string | Record<string, boolean>)[] {
  const normalizedExisting = normalizeClassList(existingClassList);
  const normalizedNew = normalizeClassList(newClass);
  return [...normalizedExisting, ...normalizedNew];
}
