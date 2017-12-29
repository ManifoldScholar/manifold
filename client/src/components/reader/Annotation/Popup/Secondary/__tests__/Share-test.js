import React from "react";
import renderer from "react-test-renderer";
import Share from "../Share";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Reader.Annotation.Popup.Secondary.Share Component", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const section = build.entity.textSection("2", { citations: { mla: "cite" } });

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Share
          text={text}
          section={section}
          direction="up"
          cite={() => {}}
          back={() => {}}
          selection={{ text: "I selected this text." }}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
