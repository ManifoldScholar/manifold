import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Utility from "global/components/utility";
import Authorize from "hoc/authorize";

export default class ListEntitiesListButtonSet extends PureComponent {
  static displayName = "List.Entities.List.Button";

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["add"]),
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    authorizedFor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    authorizedTo: PropTypes.string
  };

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

  get authorizedFor() {
    return this.props.authorizedFor;
  }

  get authorizedTo() {
    return this.props.authorizedTo;
  }

  maybeAuthorize(button) {
    if (!this.authorizedFor) return button;
    return (
      <Authorize
        entity={this.authorizedFor}
        ability={this.authorizedTo || "create"}
      >
        {button}
      </Authorize>
    );
  }

  render() {
    const buttonClassNames = classNames({
      "entity-list__button": true,
      "button-lozenge-secondary": true
    });

    return this.maybeAuthorize(
      <Link to={this.path} className={buttonClassNames}>
        {this.icon && <Utility.IconComposer icon={this.icon} />}
        <span>{this.text}</span>
      </Link>
    );
  }
}
