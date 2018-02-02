import React from "react";
import { shallow, mount, render } from "enzyme";
import renderer from "react-test-renderer";
import List from "../List";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

const events = [build.entity.event("1"), build.entity.event("2")];
const project = build.entity.project("1");

describe("Frontend.Event.List Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <List project={project} events={events} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the event-list-primary class", () => {
    expect(
      shallow(<List project={project} events={[]} />)
        .find("ul")
        .is(".event-list-primary")
    ).toBe(true);
  });

  it("renders a Tile for each event", () => {
    const wrapper = mount(wrapWithRouter(<List project={project} events={events} />));
    expect(wrapper.find(".event-tile").length).toBe(events.length);
  });
});
