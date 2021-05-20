import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

export default class UtilityBackLinkPrimary extends Component {
  static displayName = "Utility.BackLinkPrimary";

  static propTypes = {
    link: PropTypes.string,
    backText: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    backText: "Back to Project:"
  };

  render() {
    return (
      <Link
        to={this.props.link}
        className="back-link-primary back-link-primary--full"
      >
        <div className="container flush back-link-primary__container">
          <IconComposer
            icon="arrowLeft16"
            size={24}
            iconClass="back-link-primary__icon"
          />
          <span className="back-link-primary__back-text">
            {this.props.backText}
          </span>
          <span className="back-link-primary__title">{this.props.title}</span>
        </div>
      </Link>
    );
  }
}
