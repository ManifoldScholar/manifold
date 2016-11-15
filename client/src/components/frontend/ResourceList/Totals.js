import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceListTotals extends Component {

  static displayName = "ResourceList.Totals";

  static propTypes = {
    count: PropTypes.number,
    projectId: PropTypes.string
  };

  static defaultProps = {
    belongsTo: "project"
  }

  render() {
    return (
      <div className="resource-totals">
        <div className="total-count">
          {`This ${this.props.belongsTo} features `}
          <span>
            { this.props.count.toLocaleString() }
          </span>
          {' total resources'}
        </div>
        <Link to={`/browse/project/${this.props.projectId}/resources`}>
          View All Project Resources <i className="manicon manicon-arrow-right"></i>
        </Link>
      </div>
    );
  }
}
