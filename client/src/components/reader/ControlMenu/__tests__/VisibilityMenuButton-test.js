import React from "react";
import renderer from "react-test-renderer";
import VisibilityMenuButton from "../VisibilityMenuButton";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Reader.ControlMenu.VisibilityMenuButton Component", () => {
  const toggleMock = jest.fn();

  const root = <VisibilityMenuButton active={false} toggle={toggleMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggle callback when toggle is clicked", () => {
    const wrapper = Enzyme.mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-visibility"]').first().simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
