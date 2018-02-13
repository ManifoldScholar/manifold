import React from "react";
import renderer from "react-test-renderer";
import UserMenuBody from "../UserMenuBody";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.UserMenu.UserMenuBody Component", () => {
  const props = {
    hideUserMenu: jest.fn(),
    startLogout: jest.fn(),
    showLoginOverlay: jest.fn(),
    visible: false
  };

  it("renders correctly", () => {
    const component = renderer.create(<UserMenuBody {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the user-menu class", () => {
    expect(Enzyme.shallow(<UserMenuBody {...props} />).is(".user-menu")).toBe(
      true
    );
  });

  it("has the menu-visible class when props.visible is true", () => {
    expect(
      Enzyme.shallow(<UserMenuBody {...props} visible={true} />).is(
        ".menu-visible"
      )
    ).toBe(true);
  });

  it("has the menu-hidden class when props.visible is false", () => {
    expect(
      Enzyme.shallow(<UserMenuBody {...props} visible={false} />).is(
        ".menu-hidden"
      )
    ).toBe(true);
  });
});
