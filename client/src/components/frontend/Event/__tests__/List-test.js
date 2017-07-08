import React from "react";
import { shallow, mount, render } from "enzyme";
import renderer from "react-test-renderer";
import List from "../List";
import build from "test/fixtures/build";

const events = [build.entity.event("1"), build.entity.event("2")];

describe("Frontend.Event.List Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<List events={events} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the event-list-primary class", () => {
    expect(
      shallow(<List events={[]} />).find("ul").is(".event-list-primary")
    ).toBe(true);
  });

  it("renders a ProjectEvent for each event", () => {
    const wrapper = shallow(<List events={events} />);
    expect(wrapper.find("Teaser").length).toBe(events.length);
  });
});
