import React from "react";
import renderer from "react-test-renderer";
import Deleted from "../";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Global.Comment.Deleted component", () => {
  const store = build.store();
  const subject = build.entity.resource("1");
  const comment = build.entity.comment("2");

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Deleted subject={subject} comment={comment} />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
