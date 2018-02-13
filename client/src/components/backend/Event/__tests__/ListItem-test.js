import React from "react";
import ListItem from "../ListItem";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
import renderer from "react-test-renderer";
Enzyme.configure({ adapter: new Adapter() });

describe("Event.ListItem component", () => {
  const entity = {
    attributes: {
      eventType: "TWEET",
      eventTitle: "Hammer To Fall",
      excerpt:
        "He who grew up tall and proud in the shadow of the mushroom cloud"
    }
  };

  const handleDestroyMock = jest.fn();
  const fakeClick = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  };

  it("renders correctly", () => {
    const component = renderer.create(<ListItem entity={entity} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders null without an event", () => {
    const wrapper = Enzyme.shallow(<ListItem />);
    expect(wrapper.type()).toBe(null);
  });

  it("triggers the destroyHandler callback when destroy is clicked", () => {
    const wrapper = Enzyme.mount(
      <ListItem entity={entity} destroyHandler={handleDestroyMock} />
    );
    handleDestroyMock.mockClear();
    wrapper.find('[data-id="destroy"]').simulate("click", fakeClick);
    expect(handleDestroyMock).toHaveBeenCalled();
  });
});
