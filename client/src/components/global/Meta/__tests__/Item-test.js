import React from "react";
import renderer from "react-test-renderer";
import Item from "../Item";

describe("Global.Meta.Item component", () => {

  it("renders correctly when passed string", () => {
    const component = renderer.create(
      <Item
        label="aMetadataProperty"
        value="A Metadata Value"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when passed child component", () => {
    const component = renderer.create(
      <Item label="aMetadataProperty">
        <div>A Metadata Value</div>
      </Item>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
