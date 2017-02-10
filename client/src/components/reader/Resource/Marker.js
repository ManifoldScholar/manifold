import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceMarker extends Component {

  static propTypes = {
    ids: PropTypes.array,
    handleClick: PropTypes.func
  };

  render() {
    return (
      <span>
        {this.props.ids.map((id, index) => {
          return (
            <span
              key={index}
              title={id}
              data-annotation-resource={id}
              className="resource-marker"
              onClick={this.props.handleClick}
            >
              <i
                className="manicon manicon-cube-fill"
              ></i>
            </span>
          );
        })}
      </span>
    );
  }
}
