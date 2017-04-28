import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HeaderNotification from '../HeaderNotification';

describe("Global.HeaderNotification component", () => {

  const removeMock = jest.fn();
  const root = (
    <HeaderNotification
      id="1"
      heading="Welcome to the Terrordome"
      body="Here's your ticket.  Every time I get wicked."
      level={2}
      removeNotification={removeMock}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should trigger removeNotification callback when close is clicked', () => {
    const wrapper = mount(root);
    removeMock.mockClear();
    wrapper.find('[data-id="close"]').first().simulate('click');
    expect(removeMock).toHaveBeenCalled();
  });

});

