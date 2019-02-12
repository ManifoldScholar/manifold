import React from "react";
import renderer from "react-test-renderer";
import Content from "../Content";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.TextList.ListItem.Content component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={build.store()}>
          <Content
            readUrl="/foo"
            text={build.entity.text("1")}
            baseClass={"text-block"}
            showDescriptions
            showSubtitles
            showAuthors
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
