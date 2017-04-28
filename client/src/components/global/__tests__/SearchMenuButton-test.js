import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import SearchMenuButton from '../SearchMenuButton';

describe("Global.SearchMenuButton component", () => {

  const toggleSearchMenuMock = jest.fn();
  const root = (
    <SearchMenuButton
      toggleSearchMenu={toggleSearchMenuMock}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should trigger toggleSearchMenu callback when close is clicked', () => {
    const wrapper = mount(root);
    toggleSearchMenuMock.mockClear();
    wrapper.find('[data-id="toggle-menu"]').first().simulate('click');
    expect(toggleSearchMenuMock).toHaveBeenCalled();
  });

});

