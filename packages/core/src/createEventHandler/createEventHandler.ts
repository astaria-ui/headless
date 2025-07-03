import { Value } from "@sinclair/typebox/value";
import { EventHandlerType } from "./createEventHandler.validators";

export const createEventHandler = (
  originalEventHandler?: string,
  ourEventHandler?: (event: Event) => void
) => {
  if (!originalEventHandler) {
    originalEventHandler = "() => {}";
  }

  const evaledOriginalEventHandler = eval(originalEventHandler);

  return function handleEvent(event: Event) {
    if (Value.Check(EventHandlerType, evaledOriginalEventHandler)) {
      console.log("Valid event Handler");
      evaledOriginalEventHandler(event);
    } else {
      console.warn("Event Handler is invalid, still trying to run");
      try {
        evaledOriginalEventHandler?.(event);
      } catch (e) {
        console.error("Event Handler failed to execute due to: ", e);
      }
    }

    if (!event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
};
