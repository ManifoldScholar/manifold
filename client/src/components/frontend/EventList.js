import React, { Component, PropTypes } from 'react';
import { ProjectEvent } from '../../components/frontend';


export default class EventList extends Component {

  static propTypes = {
    events: PropTypes.array
  };

  // This is currently the only event list, but height matching functionality could be abstracted
  // to an optional mixin if this component needs to be used without it

  // Default inline CSS class
  state = { matchedHeight: {
    height: 'auto'
  } };

  componentDidMount = () => {
    this.setState({ matchedHeight: {
      height: this.getMaxHeight(this.refs.eventList.childNodes, 24)
    } });
  };

  // Get the maximum height of an element in a node list
  getMaxHeight = (group, verticalPadding = 0) => {
    // Match heights of the element nodes
    let maxHeight = 0;

    // Note that this is using a for loop to iterate a node list
    // instead of reducing an array
    for (let it = 0; it < group.length; it++) {
      if (group[it].offsetHeight > maxHeight) {
        maxHeight = group[it].offsetHeight;
      }
    }

    return maxHeight + (verticalPadding * 2) + 'px';
  };

  render = () => {
    return (
        <ul className="event-list" ref="eventList">
          {this.props.events.map((event) => {
            return (
                <li>
                  <div className={'event-tile ' + event.type} style={this.state.matchedHeight}>
                    <ProjectEvent event={event} />
                  </div>
                </li>
            );
          })}
        </ul>
    );
  };
}
