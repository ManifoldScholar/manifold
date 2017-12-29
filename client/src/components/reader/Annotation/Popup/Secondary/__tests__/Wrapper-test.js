import React from "react";
import renderer from "react-test-renderer";
import Wrapper from "../../Wrapper";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Reader.Annotation.Popup.Secondary.Wrapper Component", () => {
  const store = build.store();
  const text = build.entity.text(1);
  const section = build.entity.textSection(2);

  it("renders correctly when not logged in", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Wrapper
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
