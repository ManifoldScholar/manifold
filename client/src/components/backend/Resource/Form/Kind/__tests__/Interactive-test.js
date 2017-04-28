import React from 'react';
import renderer from 'react-test-renderer';
import Interactive from '../Interactive';

describe("Backend.Resource.Form.Interactive component", () => {

  function getModelValue(kind) {
    return kind;
  }

  describe("when sub kind is embed", () => {

    it('renders correctly', () => {
      const component = renderer.create(
        <Interactive
          getModelValue={() => getModelValue("embed")}
        />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when sub kind is iframe", () => {

    it('renders correctly', () => {
      const component = renderer.create(
        <Interactive
          getModelValue={() => getModelValue("iframe")}
        />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

