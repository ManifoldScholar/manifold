import React from "react";
import renderer from "react-test-renderer";
import SmartAttributes from "../SmartAttributes";
import build from "test/fixtures/build";
import FormContext from "helpers/contexts/FormContext";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Form.SmartAttributes component", () => {
  const projectCollection = build.entity.projectCollection("1");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <FormContext.Provider value={{ getModelValue: value => value, sourceModel: projectCollection }} >
          <SmartAttributes
            projectCollection={projectCollection}
          />
        </FormContext.Provider>
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
