import React from "react";
import renderer from "react-test-renderer";
import { NotificationsComponent } from "../";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";
import { mount } from "enzyme";

const store = build.store();

const props = {
  notifications: {
    notifications: [
      {
        id: "A_NOTIFICATION_1",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: "global"
      },
      {
        id: "A_NOTIFICATION_2",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: "drawer"
      }
    ]
  }
};

const component = wrapWithRouter(
  <NotificationsComponent
    {...props}
    notifications={props.notifications}
    scope="global"
    dispatch={() => {}}
  />
);

describe("Global.Notifications component", () => {
  it("renders correctly", () => {
    const component = renderer.create(component);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should not render out-of-scope notifications", () => {
    const rendered = mount(component);
    const list = rendered.find(".notification-container");
    expect(list.length).toBe(1);
  });
});
