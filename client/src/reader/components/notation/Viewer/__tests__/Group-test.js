import React from "react";
import Group from "../Group";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });

describe("Reader.Notation.Viewer.Group component", () => {
  const actions = {
    makeActive: () => {},
    startDestroy: () => {}
  };
  const entries = [
    {
      height: 110,
      location: 715,
      annotation: build.entity.annotation("1"),
      notation: build.entity.resource("2")
    },
    {
      height: 110,
      location: 715,
      annotation: build.entity.annotation("3"),
      notation: build.entity.resource("4")
    }
  ];
  const params = { textId: "5", sectionId: "6" };
  const group = { entries };

  const store = build.store();

  const props = { group, actions, params };

  const root = wrapWithRouter(
    <Provider store={store}>
      <Group {...props} />
    </Provider>
  );

  it("renders correctly", () => {
    const component = Enzyme.mount(root);
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
