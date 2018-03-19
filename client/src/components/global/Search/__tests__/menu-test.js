import React from "react";
import renderer from "react-test-renderer";
import { Search } from "components/global";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Search.Menu component", () => {
  const historyMock = {
    push: () => {}
  };

  const matchMock = {};

  it("renders correctly when search is visible", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Search.Menu.Body
          visibility={{ search: true }}
          searchType="reader"
          history={historyMock}
          match={matchMock}
          toggleVisibility={() => {}}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when search is not visible", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Search.Menu.Body
          visibility={{ search: false }}
          searchType="reader"
          history={historyMock}
          match={matchMock}
          toggleVisibility={() => {}}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
