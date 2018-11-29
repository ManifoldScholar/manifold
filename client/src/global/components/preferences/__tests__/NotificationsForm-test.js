jest.mock("react-collapse");

import React from "react";
import renderer from "react-test-renderer";
import NotificationsForm from "../NotificationsForm";

describe("Global.Preferences.NotificationsForm component", () => {
  const props = {
    preferences: {
      digest: "daily",
      projects: "always",
      followedProjects: "never",
      annotationsAndComments: "never",
      repliesToMe: "never"
    },
    changeHandler: jest.fn(),
    digestProjectsChangeHandler: jest.fn(),
    unsubscribeAllHandler: jest.fn()
  };

  it("renders correctly", () => {
    const component = renderer.create(<NotificationsForm {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
