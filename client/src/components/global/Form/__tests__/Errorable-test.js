import React from 'react';
import renderer from 'react-test-renderer';
import Errorable from '../Errorable';

describe("Global.Form.Errorable component", () => {

  const error = {
    detail: "can't be blank",
    source: {
      pointer: "/data/attributes/name"
    }
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <Errorable
        name="attributes[name]"
        children={[]}
        errors={[error]}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
