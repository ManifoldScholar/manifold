import React from "react";
import renderer from "react-test-renderer";
import Wrapper from "../Wrapper";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Ingestion.Form.Wrapper component", () => {
  const modelValueMock = jest.fn();
  const location = {};
  const history = build.history();
  const project = build.entity.project("1");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={build.store()}>
          <Wrapper
            name="attributes[something]"
            getModelValue={modelValueMock}
            location={location}
            history={history}
            project={project}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
