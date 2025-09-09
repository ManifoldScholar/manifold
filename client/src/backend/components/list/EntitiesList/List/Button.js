import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Utility from "global/components/utility";
import Authorize from "hoc/Authorize";
import Button from "global/components/atomic/Button";

export default class ListEntitiesListButtonSet extends PureComponent {
  static displayName = "List.Entities.List.Button";

  static propTypes = {
    tag: PropTypes.oneOf(["button", "link"]),
    path: PropTypes.string,
    type: PropTypes.oneOf(["add", "import", "reload", "bulkActions"]),
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    authorizedFor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    authorizedTo: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    tag: "link"
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
    if (this.type === "import") return "export24";
    if (this.type === "reload") return "reload24";
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
    const buttonClassNames = classNames(this.props.className, {
      "entity-list__button": true
    });

    const { tag, onClick } = this.props;
    const isButton = tag === "button";

    const Tag = isButton ? "button" : Link;
    const buttonProps = isButton
      ? { onClick, disabled: this.props.disabled }
      : { to: this.path };

    return this.maybeAuthorize(
      <Button
        as={Tag}
        label={this.text}
        size="sm"
        shape="lozenge"
        background="outline-accent"
        lowercase
        preIcon={this.icon}
        className={buttonClassNames}
        style={this.props.style}
        {...buttonProps}
      />
    );
  }
}
