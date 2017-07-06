import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lh from 'helpers/linkHandler';
import { Link } from 'react-router-dom';

export default class ResourceListTotals extends Component {

  static displayName = "ResourceList.Totals";

  static propTypes = {
    count: PropTypes.number,
    projectId: PropTypes.string,
    belongsTo: PropTypes.string
  };

  static defaultProps = {
    belongsTo: "project"
  };

  renderResourceCount() {
    if (!this.props.count) return null;
    return (
      <div className="total-count">
        {`This ${this.props.belongsTo} features `}
        <span data-id="count">
          { this.props.count.toLocaleString() }
        </span>
        {' total resources'}
      </div>
    );
  }

  render() {
    return (
      <div className="resource-totals" data-id="total-container">
        {this.renderResourceCount()}
        <Link to={lh.link("frontendProjectResources", this.props.projectId)}>
          View All Project Resources <i className="manicon manicon-arrow-right"></i>
        </Link>
      </div>
    );
  }
}
