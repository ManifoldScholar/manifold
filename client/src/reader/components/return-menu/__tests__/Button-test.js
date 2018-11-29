import React from "react";
import Button from "../Button";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.ReturnMenu.Button component", () => {
  const toggleMock = jest.fn();

  const root = <Button toggleReaderMenu={toggleMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggleReaderMenu callback when toggle is clicked", () => {
    const wrapper = mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-menu"]').simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
