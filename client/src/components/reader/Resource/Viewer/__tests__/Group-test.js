import React from "react";
import Group from "../Group";
import { mount } from "enzyme";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Resource.Viewer.Group component", () => {
  const items = [
    {
      annotationId: "1",
      height: 110,
      location: 715,
      resource: build.entity.resource("1")
    },
    {
      annotationId: "2",
      height: 110,
      location: 715,
      resource: build.entity.resource("2")
    }
  ];
  const store = build.store();

  const root = wrapWithRouter(
    <Provider store={store}>
      <Group items={items} />
    </Provider>
  );

  it("renders correctly", () => {
    const component = mount(root);
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
