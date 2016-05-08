import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import HeaderNotifications from '../HeaderNotifications';

function setup() {
  let props = {
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

  let output = TestUtils.renderIntoDocument(<HeaderNotifications {...props} />);
  return {
    props,
    output
  };
}

describe('components', () => {
  describe('HeaderNotifications', () => {
    it('should not render scoped notifications', () => {
      const { output } = setup();
      let listDOM = ReactDOM.findDOMNode(output.refs.notificationList);
      expect(listDOM.querySelectorAll('.header-notification-container').length).to.equal(1);
    });
  });
});
