import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

export default class UtilityBackLinkSecondary extends Component {
  static displayName = "Utility.BackLinkSecondary";

  static propTypes = {
    link: PropTypes.string,
    backText: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    backText: "Back to Project"
  };

  render() {
    return (
      <div className="container flush">
        <Link to={this.props.link} className="back-link-secondary">
          <IconComposer
            icon="circleArrowLeft64"
            size={56}
            iconClass="back-link-secondary__icon"
          />
          <div className="back-link-secondary__text">
            <span className="back-link-secondary__back-text">
              {this.props.backText}
            </span>
            <span className="back-link-secondary__project-title">
              {this.props.title}
            </span>
          </div>
        </Link>
      </div>
    );
  }
}
