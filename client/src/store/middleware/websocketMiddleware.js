/* eslint-disable import/no-mutable-exports */
import ActionCable from "actioncable";
import get from "lodash/get";
import { websocketActions } from "actions";
import config from "config";

let actionCableMiddleware = ({ dispatchIgnored, getStateIgnored }) => {
  return next => action => {
    next(action);
  };
};

if (__BROWSER__) {
  let cable = null;
  const openSubscriptions = {};

  const socketHandler = (dispatch, channel) => {
    return {
      connected: () => {
        dispatch(websocketActions.subscribed(channel));
      },
      received: packet => {
        dispatch(websocketActions.messageReceived(channel, packet));
        if (packet.type === "entity") {
          const type = "API_RESPONSE/WEBSOCKET_MODEL_UPDATE";
          dispatch({
            type,
            error: null,
            payload: packet.payload,
            meta: "websocket-model-update"
          });
        }
      }
    };
  };

  class CableMonitor {
    constructor(consumer, onSuccessCallback, onFailCallback) {
      this.cable = consumer;
      this.onSuccessCallback = onSuccessCallback;
      this.onFailCallback = onFailCallback;
      this.period = 1000;
      this.polls = 0;
      this.pointer = null;
      this.connection = cable.connection;
      this.monitor = cable.connection.monitor;
    }

    start = () => {
      this.pointer = setInterval(this.poll, this.period);
    };

    shouldStop = () => {
      if (this.connection.disconnected === false) return true;
      if (this.polls >= 10) return true;
      if (this.monitor.reconnectAttempts > 5) return true;
      return false;
    };

    stop = () => {
      clearInterval(this.pointer);
      if (this.connection.disconnected === true) return this.onFailCallback();
      if (this.connection.disconnected === false)
        return this.onSuccessCallback();
    };

    poll = () => {
      this.polls++;
      if (this.shouldStop()) this.stop();
    };
  }

  actionCableMiddleware = ({ dispatch, getState }) => {
    return next => action => {
      const handledActions = [
        "WEBSOCKET_SUBSCRIBE",
        "WEBSOCKET_UNSUBSCRIBE",
        "WEBSOCKET_TRIGGER_ACTION"
      ];

      if (!handledActions.includes(action.type)) return next(action);

      const token = get(getState(), "authentication.authToken");
      const { channel, options } = action.payload;

      if (action.type === "WEBSOCKET_SUBSCRIBE") {
        if (cable === null || cable.connection.disconnected === true) {
          if (cable === null) {
            cable = ActionCable.createConsumer(config.services.cable);
          } else {
            cable.connect();
          }
          dispatch({ type: "START_LOADING", payload: "WEBSOCKET_SUBSCRIBE" });
          dispatch({ type: "WEBSOCKET_CONNECTION_BEGIN" });
          new CableMonitor(
            cable,
            () => {
              // on successful connection
              dispatch({ type: "WEBSOCKET_CONNECT" });
              dispatch({
                type: "STOP_LOADING",
                payload: "WEBSOCKET_SUBSCRIBE"
              });
            },
            () => {
              // on unsuccessful connection
              dispatch({ type: "WEBSOCKET_CONNECTION_FAILURE" });
              dispatch({
                type: "STOP_LOADING",
                payload: "WEBSOCKET_SUBSCRIBE"
              });
              cable.disconnect();
            }
          ).start();
        }
        const subscription = cable.subscriptions.create(
          { channel, token, ...options },
          socketHandler(dispatch, channel)
        );
        openSubscriptions[channel] = subscription;
      }

      if (action.type === "WEBSOCKET_UNSUBSCRIBE") {
        const subscription = openSubscriptions[channel];
        if (subscription) cable.subscriptions.remove(subscription);
      }

      if (action.type === "WEBSOCKET_TRIGGER_ACTION") {
        const subscription = openSubscriptions[channel];
        if (subscription) subscription.perform(action.payload.action);
      }

      return next(action);
    };
  };
}

export default actionCableMiddleware;
