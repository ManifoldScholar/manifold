import React from 'react';
import renderer from 'react-test-renderer';
import Video from '../Video';

describe("Backend.Resource.Form.Video component", () => {

  function getModelValue(kind) {
    return kind;
  }

  it('renders correctly', () => {
    const component = renderer.create(
      <Video
        getModelValue={() => getModelValue("")}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("when sub kind is external_video", () => {

    it('renders correctly', () => {
      const component = renderer.create(
        <Video
          getModelValue={() => getModelValue("external_video")}
          sourceModel={{
            attributes: {}
          }}
        />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

