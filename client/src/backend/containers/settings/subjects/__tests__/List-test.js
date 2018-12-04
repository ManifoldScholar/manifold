import React from "react";
import renderer from "react-test-renderer";
import { SettingsSubjectsListContainer } from "../List";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Settings Subjects List Container", () => {
  const store = build.store();
  const subject = build.entity.subject("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <SettingsSubjectsListContainer
          subjects={[subject]}
          subjectsMeta={{
            pagination: build.pagination()
          }}
          match={{
            params: {}
          }}
          route={{}}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
