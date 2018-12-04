import React from "react";
import renderer from "react-test-renderer";
import UserMenuBody from "../";
import { wrapWithRouter } from "test/helpers/routing";
import Enzyme from "enzyme/build/index";

describe("Global.UserMenu.UserMenuBody Component", () => {
  const props = {
    hideUserMenu: jest.fn(),
    startLogout: jest.fn(),
    showLoginOverlay: jest.fn(),
    history: {},
    visible: false
  };

  const build = (addProps = {}) => {
    const mergeProps = Object.assign({}, props, addProps);
    return wrapWithRouter(<UserMenuBody {...mergeProps} />);
  };

  const buildInstance = (addProps = {}) => {
    const root = Enzyme.mount(build(addProps));
    return root
      .findWhere(node => {
        return node.name() === "UserMenuBodyComponent";
      })
      .first()
      .childAt(0);
  };

  it("renders correctly", () => {
    const component = renderer.create(build());
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the user-menu class", () => {
    expect(buildInstance().hasClass("user-menu")).toBe(true);
  });

  it("has the menu-visible class when props.visible is true", () => {
    expect(buildInstance({ visible: true }).exists(".menu-visible")).toBe(true);
  });

  it("has the menu-hidden class when props.visible is false", () => {
    expect(buildInstance({ visible: false }).exists(".menu-hidden")).toBe(true);
  });
});
