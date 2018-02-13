import React from "react";
import renderer from "react-test-renderer";
import Overlay from "../Overlay";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

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
    const wrapper = Enzyme.mount(root);
    closeMock.mockClear();
    wrapper.find('[data-id="overlay-close"]').first().simulate("click");
    expect(closeMock).toHaveBeenCalled();
  });
});
