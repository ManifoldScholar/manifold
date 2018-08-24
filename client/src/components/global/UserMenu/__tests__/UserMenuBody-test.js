import React from "react";
import renderer from "react-test-renderer";
import UserMenuBody from "../UserMenuBody";
import { wrapWithRouter } from "test/helpers/routing";
import { shallow } from "enzyme";

describe("Global.UserMenu.UserMenuBody Component", () => {
  const props = {
    hideUserMenu: jest.fn(),
    startLogout: jest.fn(),
    showLoginOverlay: jest.fn(),
    history: {},
    visible: false
  };

  it("renders correctly", () => {
    const component = renderer.create(wrapWithRouter(<UserMenuBody {...props} />));
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the user-menu class", () => {
    expect(shallow(wrapWithRouter(<UserMenuBody {...props} />)).exists(".user-menu")).toBe(
      true
    );
  });

  it("has the menu-visible class when props.visible is true", () => {
    expect(
      shallow(wrapWithRouter(<UserMenuBody {...props} visible={true} />)).exists(
        ".menu-visible"
      )
    ).toBe(true);
  });

  it("has the menu-hidden class when props.visible is false", () => {
    expect(
      shallow(wrapWithRouter(<UserMenuBody {...props} visible={false} />)).exists(
        ".menu-hidden"
      )
    ).toBe(true);
  });
});
