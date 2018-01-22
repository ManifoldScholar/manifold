import React from "react";
import renderer from "react-test-renderer";
import Share from "../Share";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Reader.Annotation.Popup.Share Component", () => {
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Share selectionText="bananas" cite={() => {}} back={() => {}} />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
