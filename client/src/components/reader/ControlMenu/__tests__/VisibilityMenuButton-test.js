import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import VisibilityMenuButton from "../VisibilityMenuButton";

describe("Reader.ControlMenu.VisibilityMenuButton Component", () => {
  const toggleMock = jest.fn();

  const root = <VisibilityMenuButton active={false} toggle={toggleMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggle callback when toggle is clicked", () => {
    const wrapper = mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-visibility"]').first().simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
