import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class EventAllLink extends Component {
  static displayName = "Event.AllLink";

  static propTypes = {
    count: PropTypes.number,
    threshold: PropTypes.number,
    project: PropTypes.object.isRequired
  };

  render() {
    const { project } = this.props;
    if (this.props.count <= this.props.threshold) return null;
    return (
      <div className="utility list-tools">
        <Link
          to={lh.link("frontendProjectEvents", project.attributes.slug)}
          className="button-primary"
        >
          See all Activity
        </Link>
      </div>
    );
  }
}
