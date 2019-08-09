import React from "react";
import renderer from "react-test-renderer";
import DatePicker from "../DatePicker";

describe("Backend.Form.DatePicker component", () => {
  const setMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <DatePicker value={"1989-10-10"} label="Some date" set={setMock} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
