import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class ListEntitiesListButtonSet extends PureComponent {
  static displayName = "List.Entities.List.Button";

  get path() {
    return this.props.path;
  }

  get type() {
    return this.props.type;
  }

  get icon() {
    if (this.props.icon) return this.props.icon;
    if (this.type === "add") return "circlePlus32";
  }

  get text() {
    return this.props.text;
  }

  render() {

    const buttonClassNames = classNames({
      "entity-list__button": true,
    });

    return (
      <Link
        to={this.path}
        className={buttonClassNames}
      >
        {this.icon && <Utility.IconComposer icon={this.icon} />}
        {this.text}
      </Link>
    )
  }
}
