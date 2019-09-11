import { handleActions } from "redux-actions";
import has from "lodash/has";

export const initialState = {
  connected: false,
  connecting: false,
  failure: false,
  channels: {}
};

function _openChannel(state, channelName) {
  if (has(state.channels, channelName)) return state;
  const defaultChannelState = {
    active: false,
    message: null
  };
  const channel = { [channelName]: defaultChannelState };
  const channels = { ...state.channels, ...channel };
  return { ...state, channels };
}

function _updateChannels(state, channels) {
  return { ...state, channels };
}

function _updateChannel(state, channelName, overlay) {
  const channel = { ...state.channels[channelName], ...overlay };
  const channels = { ...state.channels, [channelName]: channel };
  return _updateChannels(state, channels);
}

function _closeChannel(state, channelName) {
  const channels = { ...state.channels };
  delete channels[channelName];
  return _updateChannels(state, channels);
}

function _addMessage(state, channelName, message) {
  const channel = { ...state.channels[channelName] };
  const id = has(channel, "message.id") ? channel.message.id + 1 : 1;
  channel.message = { type: message.type, payload: message.payload, id };
  return _updateChannel(state, channelName, channel);
}

function activateChannel(state, action) {
  const channelName = action.payload.channel;
  const channel = { ...state.channels[channelName] };
  channel.active = true;
  return _updateChannel(state, channelName, channel);
}

function openChannel(state, action) {
  return _openChannel(state, action.payload.channel);
}

function closeChannel(state, action) {
  return _closeChannel(state, action.payload.channel);
}

function receiveMessage(currentState, action) {
  const { channel, message } = action.payload;
  const state = _openChannel(currentState, channel);
  return _addMessage(state, channel, message);
}

function startConnecting(currentState) {
  return {
    ...currentState,
    connecting: true,
    failure: false,
    connected: false
  };
}

function connect(currentState) {
  return {
    ...currentState,
    connected: true,
    failure: false,
    connecting: false
  };
}

function disconnect(currentState) {
  return { ...currentState, connected: false };
}

function handleFailure(currentState) {
  return {
    ...currentState,
    connected: false,
    connecting: false,
    failure: true
  };
}

export default handleActions(
  {
    WEBSOCKET_CONNECTION_BEGIN: startConnecting,
    WEBSOCKET_CONNECT: connect,
    WEBSOCKET_CONNECTION_FAILURE: handleFailure,
    WEBSOCKET_DISCONNECT: disconnect,
    WEBSOCKET_SUBSCRIBE: openChannel,
    WEBSOCKET_SUBSCRIBED: activateChannel,
    WEBSOCKET_UNSUBSCRIBED: closeChannel,
    WEBSOCKET_MESSAGE_RECEIVED: receiveMessage
  },
  initialState
);
