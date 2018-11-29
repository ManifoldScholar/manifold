import React from "react";
import renderer from "react-test-renderer";
import { CommentEditor } from "../Editor";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import auth from "test/helpers/auth";

describe("Global Comment Editor Container", () => {
  const store = build.store();
  const comment = build.entity.comment("1");
  const resource = build.entity.resource("2");
  const cancelMock = jest.fn();
  const user = build.entity.user("3");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <CommentEditor
          dispatch={store.dispatch}
          comment={comment}
          subject={resource}
          cancel={cancelMock}
        />
      </Provider>
    )
  );

  it("renders correctly when logged in", () => {
    auth.startSession(store.dispatch, user);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    auth.endSession(store.dispatch);
  });

  it("renders correctly when logged out", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
