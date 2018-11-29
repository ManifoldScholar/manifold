import React from "react";
import renderer from "react-test-renderer";
import Notification from "../";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.HeaderNotification component", () => {
  const removeMock = jest.fn();
  const root = (
    <Notification
      id="1"
      heading="Welcome to the Terrordome"
      body="Here's your ticket.  Every time I get wicked."
      level={2}
      removeNotification={removeMock}
    />
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger removeNotification callback when close is clicked", () => {
    const wrapper = Enzyme.mount(root);
    removeMock.mockClear();
    wrapper
      .find('[data-id="close"]')
      .first()
      .simulate("click");
    expect(removeMock).toHaveBeenCalled();
  });
});
