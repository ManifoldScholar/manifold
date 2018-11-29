import React from "react";
import renderer from "react-test-renderer";
import { Form } from "components/backend";
import { Provider } from "react-redux";
import createStore from "store/createStore";
const store = createStore();

describe("Backend.Form.TagList component", () => {
  const element = (
    <Provider store={store}>
      <Form.TagList label="Tags" name="attributes[tags]" />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
