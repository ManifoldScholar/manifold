import React from "react";
import renderer from "react-test-renderer";
import { Form } from "components/backend";
import { Provider } from "react-redux";
import createStore from "store/createStore";

describe("Backend.Form.HasMany component", () => {
  const store = createStore();

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Form.HasMany
          label="makers"
          entities={[
            { id: 1, attributes: { name: "John" } },
            { id: 2, attributes: { name: "Jane" } }
          ]}
          onChange={() => {}}
          optionsFetch={() => {}}
          onNew={() => {}}
          entityLabelAttribute="name"
          orderable
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
