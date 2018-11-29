import React from "react";
import renderer from "react-test-renderer";
import Footer from "reader/components/footer";

describe("Reader.Footer component", () => {
  const text = {
    attributes: {
      metadataFormatted: {
        rights: "All rights <em>reserved</em>"
      }
    }
  };

  it("renders correctly", () => {
    const component = renderer.create(<Footer text={text} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
