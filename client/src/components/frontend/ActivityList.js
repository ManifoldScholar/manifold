import React, { Component, PropTypes } from 'react';
import { ProjectActivityUpdate } from '../../components/frontend';


export default class ActivityList extends Component {

  static propTypes = {
    activity: PropTypes.array
  };

  // This is currently the only activity list, but height matching functionality could be abstracted
  // to an optional mixin if this component needs to be used without it

  // Default inline CSS class
  state = {matchedHeight: {
    height: 'auto'
  }};

  componentDidMount = () => {
    this.setState({matchedHeight: {
      height: this.getMaxHeight(this.refs.activityList.childNodes, 24)
    }});
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
        <ul className="project-activity-list" ref="activityList">
          {this.props.activity.map((update) => {
            return (
                <li>
                  <div className={'activity-update ' + update.type} style={this.state.matchedHeight}>
                    <ProjectActivityUpdate update={update} />
                  </div>
                </li>
            );
          })}
        </ul>
    );
  };
}
