import React from "react";
import renderer from "react-test-renderer";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });

import NotesButton from "../NotesButton";

describe("Reader.ControlMenu.NotesButton Component", () => {
  const toggleMock = jest.fn();

  const root = <NotesButton toggle={toggleMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggle callback when toggle is clicked", () => {
    const wrapper = Enzyme.mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-notes"]').simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
