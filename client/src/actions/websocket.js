import { createAction } from "redux-actions";

export const subscribe = createAction(
  "WEBSOCKET_SUBSCRIBE",
  (channel, options) => {
    return { channel, options };
  }
);

export const subscribed = createAction("WEBSOCKET_SUBSCRIBED", channel => {
  return { channel };
});

export const unsubscribe = createAction("WEBSOCKET_UNSUBSCRIBE", channel => {
  return { channel };
});

export const unsubscribed = createAction("WEBSOCKET_UNSUBSCRIBED", channel => {
  return { channel };
});

export const messageReceived = createAction(
  "WEBSOCKET_MESSAGE_RECEIVED",
  (channel, message) => {
    return { channel, message };
  }
);

export const actionReceived = createAction(
  "WEBSOCKET_ACTION_RECEIVED",
  (channel, action) => {
    return { channel, action };
  }
);

export const triggerAction = createAction(
  "WEBSOCKET_TRIGGER_ACTION",
  (channel, action) => {
    return { channel, action };
  }
);
