import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";

export default class NestedLink extends React.PureComponent {
  static propTypes = {};

  static displayName = "GenericTable.NestedLink";

  get nestedLinkArrowClassNames() {
    return "table__nested-link-arrow";
  }

  get nestedLinkClassNames() {
    return "table__nested-link";
  }

  get nestedLink() {
    return this.props.link;
  }

  render() {
    return (
      <Link className={this.nestedLinkClassNames} to={this.nestedLink}>
        <span>{this.props.children}</span>
        <Utility.IconComposer
          icon="arrowRight16"
          size={14}
          iconClass={this.nestedLinkArrowClassNames}
        />
      </Link>
    );
  }
}
