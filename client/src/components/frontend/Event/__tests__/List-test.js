import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Event } from 'components/frontend';

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

  it("has the event-list-primary class", () => {
    expect(shallow(<Event.List events={[]} />).find('ul').is('.event-list-primary')).toBe(true)
  });

  it("renders a ProjectEvent for each event", () => {
    const events = mockEvents();
    const wrapper = shallow(<Event.List events={events} />);
    expect(wrapper.find('Teaser').length).toBe(events.length);
  });

});

