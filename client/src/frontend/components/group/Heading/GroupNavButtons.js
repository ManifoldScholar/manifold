import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class GroupNavButtons extends React.PureComponent {
  static propTypes = {
    links: PropTypes.array
  };

  get buttonClassNames() {
    return "group-page-heading__nav-button";
  }

  render() {
    const { links } = this.props;
    if (!links || links.length === 0) return null;
    return (
      <div className={"group-page-heading__button-container"}>
        {links.map(link => (
          <Link key={link.to} className={this.buttonClassNames} to={link.to}>
            {link.text}
          </Link>
        ))}
      </div>
    );
  }
}
