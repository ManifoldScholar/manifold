import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import lh from 'helpers/linkHandler';

export default class EventAllLink extends Component {

  static displayName = "Event.AllLink";

  static propTypes = {
    count: PropTypes.number,
    threshold: PropTypes.number,
    projectId: PropTypes.string
  };

  getAllLink() {
    let allLink = null;

    if (this.props.count > this.props.threshold) {
      allLink = (
        <div className="section-heading-utility-right">
          <Link
            to={lh.link("frontendProjectEvents", this.props.projectId)}
            className="button-primary"
          >
            See all Activity
          </Link>
        </div>
      );
    }

    return allLink;
  }

  render() {
    return this.getAllLink();
  }
}
