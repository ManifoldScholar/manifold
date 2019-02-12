import React from "react";
import renderer from "react-test-renderer";
import Bibliographic from "../Bibliographic";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.TextList.ListItem.Bibliographic component", () => {
  const text = build.entity.text("1");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={build.store()}>
          <Bibliographic
            readUrl="/foo"
            baseClass={"text-block"}
            description={text.attributes.description}
            subtitle={text.attributes.subtitle}
            date={text.attributes.createdAt}
            datePrefix={"Added"}
            title={text.attributes.title}
            creatorNames={text.attributes.creatorNames}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
