import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import classNames from "classnames";

export default class EventAllLink extends Component {
  static displayName = "Event.AllLink";

  static propTypes = {
    count: PropTypes.number,
    threshold: PropTypes.number,
    project: PropTypes.object.isRequired,
    wrapperClasses: PropTypes.string
  };

  render() {
    const { project, wrapperClasses } = this.props;
    if (this.props.count <= this.props.threshold) return null;
    return (
      <div className={classNames(wrapperClasses)}>
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
