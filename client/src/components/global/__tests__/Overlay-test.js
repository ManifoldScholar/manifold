import React from "react";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
import Overlay from "../Overlay";

describe("Global.Overlay component", () => {
  const children = <div>Test me</div>;
  const closeMock = jest.fn();

  const root = <Overlay children={children} closeCallback={closeMock} />;

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger closeCallback callback when close is clicked", () => {
    const wrapper = mount(root);
    closeMock.mockClear();
    wrapper.find('[data-id="overlay-close"]').first().simulate("click");
    expect(closeMock).toHaveBeenCalled();
  });
});
