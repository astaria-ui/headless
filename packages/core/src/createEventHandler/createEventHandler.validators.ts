import { Type } from "@sinclair/typebox";

export const EventHandlerType = Type.Function(
  [Type.Object({ defaultPrevented: Type.Boolean() })],
  Type.Void()
);
export const CreateEventHandlerType = Type.Function(
  [Type.Optional(Type.String()), EventHandlerType],
  EventHandlerType
);
