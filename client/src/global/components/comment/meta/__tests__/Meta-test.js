import React from "react";
import renderer from "react-test-renderer";
import Meta from "../";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Global.Comment.Detail component", () => {
  const store = build.store();

  const creator = build.entity.user("1");
  const comment = build.entity.comment("2");

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Meta creator={creator} comment={comment} />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
