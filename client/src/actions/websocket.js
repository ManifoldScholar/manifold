import { createAction } from "redux-actions";

export const connect = createAction("WEBSOCKET_CONNECT", (channel, options) => {
  return { channel, options };
});

export const connected = createAction("WEBSOCKET_CONNECTED", channel => {
  return { channel };
});

export const disconnect = createAction("WEBSOCKET_DISCONNECT", channel => {
  return { channel };
});

export const disconnected = createAction("WEBSOCKET_DISCONNECTED", channel => {
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
