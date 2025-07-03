import { atom } from "nanostores";

type ChangeHandler<T> = (value: T, prevvalue: T) => void;

interface CreateControllableStateParams<T> {
  value?: T;
  defaultvalue: T;
  onchange?: ChangeHandler<T>;
}

export const createControllableState = <T>({
  value,
  defaultvalue,
  onchange,
}: CreateControllableStateParams<T>) => {
  const $state = atom(value ?? defaultvalue);
  onchange && $state.listen(onchange);
  return $state;
};
