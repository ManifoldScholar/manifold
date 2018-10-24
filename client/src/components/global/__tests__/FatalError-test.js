import React from "react";
import renderer from "react-test-renderer";
import FatalError from "../FatalError";

describe("Global.FatalError component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <FatalError
        fatalError={{
          error: {
            status: 404,
            heading: "Kriss Kross'll make you",
            body: "Jump, jump"
          },
          type: "TEST"
        }}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
