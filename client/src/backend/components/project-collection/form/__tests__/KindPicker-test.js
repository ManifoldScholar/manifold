import React from "react";
import renderer from "react-test-renderer";
import KindPicker from "../KindPicker";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Form.KindPicker component", () => {
  const projectCollection = build.entity.projectCollection("1");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <KindPicker
            getModelValue={() => projectCollection.attributes.smart}
            setOther={jest.fn}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
