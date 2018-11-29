import React from "react";
import renderer from "react-test-renderer";
import UserMenuButton from "../";

describe("Global.UserMenu.UserMenuButton Component", () => {
  const props = {
    startLogout: jest.fn(),
    showLoginOverlay: jest.fn(),
    toggleUserMenu: jest.fn(),
    visible: false
  };

  it("renders correctly", () => {
    const component = renderer.create(<UserMenuButton {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
