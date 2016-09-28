import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { EventList } from 'components/frontend';

function mockEvents() {
  return [
    {
      content: "some content",
      user: { displayName: "Jane Smith"},
      title: "a title",
      date: "12/10/76"
    },
    {
      content: "some content",
      user: { displayName: "Jane Smith"},
      title: "a title",
      date: "12/10/76"
    }
  ]
}

describe("EventList Component", () => {

  it("has the event-list class", () => {
    expect(shallow(<EventList events={[]} />).is('.event-list')).toBe(true)
  });

  it("renders a ProjectEvent for each event", () => {
    const events = mockEvents();
    const wrapper = shallow(<EventList events={events} />);
    expect(wrapper.find('ProjectEvent').length).toBe(events.length);
  });

});

