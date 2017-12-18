import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import AppearanceMenuButton from "../AppearanceMenuButton";

describe("Reader.ControlMenu.AppearanceMenuButton Component", () => {
  const toggleMock = jest.fn();

  const root = <AppearanceMenuButton toggleAppearanceMenu={toggleMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggleAppearanceMenu callback when toggle is clicked", () => {
    const wrapper = mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-appearance"]').simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
