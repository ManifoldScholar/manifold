import React from 'react';
import { mount } from 'enzyme';
import Detail from '../Detail';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Resource.Detail component", () => {

  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("2");
  const closeMock = jest.fn();

  const root = (
    wrapWithRouter(
      <Detail
        resource={resource}
        handleClose={closeMock}
      />
    )
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should trigger handleClose callback when close is clicked', () => {
    const wrapper = mount(root);
    closeMock.mockClear();
    wrapper.find('[data-id="close-overlay"]').simulate('click');
    expect(closeMock).toHaveBeenCalled();
  });

});
