import React from "react";
import renderer from "react-test-renderer";
import FooterMenu from "../FooterMenu";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Reader.FooterMenu Component", () => {
  const store = build.store();
  const currentUser = build.entity.user("1");
  const visibility = {
    uiPanels: {}
  };
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: currentUser
    }
  });

  const root = (
    <Provider store={store}>
      <FooterMenu visibility={visibility} />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
