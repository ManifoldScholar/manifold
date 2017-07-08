import React from "react";
import renderer from "react-test-renderer";
import Filters from "../Filters";

describe("Frontend.ProjectList.Filters component", () => {
  const subjects = [
    {
      type: "subjects",
      id: "1",
      attributes: {
        name: "Subject 1"
      }
    },
    {
      type: "subjects",
      id: "2",
      attributes: {
        name: "Subject 2"
      }
    }
  ];
  const updateActionMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <Filters updateAction={updateActionMock} subjects={subjects} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
