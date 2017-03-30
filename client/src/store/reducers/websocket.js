import { handleActions } from 'redux-actions';
import has from 'lodash/has';

export const initialState = {
  channels: {}
};

function _openChannel(state, channelName) {
  if (has(state.channels, channelName)) return state;
  const defaultChannelState = {
    active: false,
    message: null
  };
  const channel = { [channelName]: defaultChannelState };
  const channels = Object.assign({}, state.channels, channel);
  return Object.assign({}, state, { channels });
}

function _updateChannels(state, channels) {
  return Object.assign({}, state, { channels });
}

function _updateChannel(state, channelName, overlay) {
  const channel = Object.assign({}, state.channels[channelName], overlay);
  const channels = Object.assign({}, state.channels, { [channelName]: channel });
  return _updateChannels(state, channels);
}

function _closeChannel(state, channelName) {
  const channels = Object.assign({}, state.channels);
  delete channels[channelName];
  return _updateChannels(state, channels);
}

function _addMessage(state, channelName, message) {
  const channel = Object.assign({}, state.channels[channelName]);
  const id = has(channel, 'message.id') ? channel.message.id + 1 : 1;
  channel.message = { type: message.type, payload: message.payload, id };
  return _updateChannel(state, channelName, channel);
}

function activateChannel(state, action) {
  const channelName = action.payload.channel;
  const channel = Object.assign({}, state.channels[channelName]);
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

export default handleActions({
  WEBSOCKET_CONNECT: openChannel,
  WEBSOCKET_CONNECTED: activateChannel,
  WEBSOCKET_DISCONNECTED: closeChannel,
  WEBSOCKET_MESSAGE_RECEIVED: receiveMessage
}, initialState);
