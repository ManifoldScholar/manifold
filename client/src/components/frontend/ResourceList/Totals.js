import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { linkHelpers as lh } from 'routes';

export default class ResourceListTotals extends Component {

  static displayName = "ResourceList.Totals";

  static propTypes = {
    count: PropTypes.number,
    projectId: PropTypes.string,
    belongsTo: PropTypes.string
  };

  static defaultProps = {
    belongsTo: "project"
  }

  render() {
    if (!this.props.count) return null;
    return (
      <div className="resource-totals">
        <div className="total-count">
          {`This ${this.props.belongsTo} features `}
          <span>
            { this.props.count.toLocaleString() }
          </span>
          {' total resources'}
        </div>
        <Link
          to={lh.frontendProjectResources(this.props.projectId)}
        >
          View All Project Resources <i className="manicon manicon-arrow-right"></i>
        </Link>
      </div>
    );
  }
}
