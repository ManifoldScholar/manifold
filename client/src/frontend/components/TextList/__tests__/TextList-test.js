import React from "react";
import renderer from "react-test-renderer";
import TextList from "../";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.TextList component", () => {
  const texts = [build.entity.text("1"), build.entity.text("2")];
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <TextList
            texts={texts}
            label="A Label"
            showAuthors
            showDates
            showDescriptions
            showSubtitles
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
