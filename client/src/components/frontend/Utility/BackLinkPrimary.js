import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class UtilityBackLinkPrimary extends Component {
  static displayName = "Utility.BackLinkPrimary";

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
      <Link to={this.props.link} className="back-link-primary full">
        <div className="container flush">
          <i className="manicon manicon-arrow-left" aria-hidden="true" />
          {this.props.backText}
          <span>{this.props.title}</span>
        </div>
      </Link>
    );
  }
}
