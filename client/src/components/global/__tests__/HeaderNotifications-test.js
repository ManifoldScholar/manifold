import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import TestUtils from 'react-addons-test-utils';
import HeaderNotifications from '../HeaderNotifications';

const props = {
  addNotification: () => {},
  removeNotification: () => {},
  removeAllNotifications: () => {},
  notifications: {
    notifications: [
      {
        id: "A_NOTIFICATION_1",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: null
      },
      {
        id: "A_NOTIFICATION_2",
        level: 2,
        heading: "A Heading",
        body: "The body.",
        scope: "Scoped"
      }
    ]
  }
};

function setup() {
  let output = TestUtils.renderIntoDocument(<HeaderNotifications {...props} />);
  return {
    props,
    output
  };
}

describe('Global.HeaderNotifications component', () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <HeaderNotifications
        {...props}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render scoped notifications', () => {
    const { output } = setup();
    let listDOM = ReactDOM.findDOMNode(output.refs.notificationList);
    expect(listDOM.querySelectorAll('.header-notification-container').length).toBe(1);
  });
});
