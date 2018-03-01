import React from "react";
import ListItem from "../ListItem";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";

describe("Backend Project Log Container", () => {
  const resourceVersion = build.entity.version("1");
  const projectVersion = build.entity.version("2", {
    itemId: "1",
    itemType: "Project"
  });
  const store = build.store();

  it("renders correctly when project change", () => {
    const component = wrapWithRouter(
      <Provider store={store}>
        <ListItem entity={projectVersion} />
      </Provider>
    );
    const snapshot = renderer.create(component).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it("renders correctly when project child change", () => {
    const component = wrapWithRouter(
      <Provider store={store}>
        <ListItem entity={resourceVersion} />
      </Provider>
    );
    const snapshot = renderer.create(component).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
