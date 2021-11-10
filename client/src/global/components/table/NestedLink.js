import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";

export default class NestedLink extends React.PureComponent {
  static propTypes = {};

  static displayName = "GenericTable.NestedLink";

  get nestedLink() {
    return this.props.link;
  }

  render() {
    return (
      <Link className="table__nested-link" to={this.nestedLink}>
        <span>{this.props.children}</span>
        <Utility.IconComposer
          icon="arrowRight16"
          size={14}
          className="table__nested-link-arrow"
        />
      </Link>
    );
  }
}
