import websocketReducer, { initialState } from "../websocket";
import { websocketActions } from "actions";

const channelName = "TheChannel";
const sent = { type: "log", payload: "this is a message" };

describe("store/reducers/websocket", () => {
  it("should return the initial state", () => {
    const state = websocketReducer(undefined, {
      type: "SOME UNRELATED ACTION"
    });
    expect(state).toEqual(initialState);
  });

  it("should open a channel", () => {
    const action = websocketActions.connected(channelName);
    const state = websocketReducer(undefined, action);
    expect(state).toEqual({
      channels: {
        [channelName]: {
          active: true
        }
      }
    });
  });

  it("should close a channel", () => {
    let state;
    state = websocketReducer(
      undefined,
      websocketActions.connected(channelName)
    );
    state = websocketReducer(state, websocketActions.disconnected(channelName));
    expect(state).toEqual({
      channels: {}
    });
  });

  describe("when adding a message it", () => {
    let action = websocketActions.messageReceived(channelName, sent);
    let state = websocketReducer(undefined, action);

    it("should add a message to a channel", () => {
      expect(state).toEqual({
        channels: {
          [channelName]: {
            active: false,
            message: {
              type: sent.type,
              payload: sent.payload,
              id: 1
            }
          }
        }
      });
    });

    it("should increment the next message ID by 1", () => {
      action = websocketActions.messageReceived(channelName, sent);
      state = websocketReducer(state, action);
      expect(state.channels[channelName].message.id).toEqual(2);
    });
  });
});
