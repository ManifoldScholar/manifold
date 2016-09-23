import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceTotals extends Component {

  static propTypes = {
    count: PropTypes.number,
    projectId: PropTypes.string
  };

  render() {
    return (
      <div className="resource-totals">
        <div className="total-count">
          {'This project has '}
          <span>
            { this.props.count.toLocaleString() }
          </span>
          {' total resources'}
        </div>
        <Link to={`/browse/project/${this.props.projectId}/resources`}>
          View All Resources <i className="manicon manicon-arrow-right"></i>
        </Link>
      </div>
    );
  }
}
