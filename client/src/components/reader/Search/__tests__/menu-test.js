import React from "react";
import renderer from "react-test-renderer";
import { ReaderSearchMenu } from "../Menu";

describe("Reader.Search.Menu component", () => {
  const historyMock = {
    push: () => {}
  };

  const matchMock = {};

  it("renders correctly when search is visibile", () => {
    const component = renderer.create(
      <ReaderSearchMenu
        visibility={{ search: true }}
        history={historyMock}
        match={matchMock}
        toggleVisibility={() => {}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when search is not visibile", () => {
    const component = renderer.create(
      <ReaderSearchMenu
        visibility={{ search: false }}
        history={historyMock}
        match={matchMock}
        toggleVisibility={() => {}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
