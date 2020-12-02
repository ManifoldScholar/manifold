import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Layout from "backend/components/layout";
import isNil from "lodash/isNil";

export default class ListEntitiesListBarTitle extends PureComponent {
  static displayName = "List.Entities.List.BarTitle";

  static propTypes = {
    title: PropTypes.node,
    titleIcon: PropTypes.string,
    titleLink: PropTypes.string,
    count: PropTypes.node
  };

  get title() {
    return this.props.title;
  }

  get titleIcon() {
    return this.props.titleIcon;
  }

  get count() {
    return this.props.count;
  }

  get hasCount() {
    return !isNil(this.count);
  }

  render() {
    return (
      <Layout.ViewHeader
        className="entity-list__title-block"
        icon={this.titleIcon}
        iconAccented
        count={this.count}
      >
        {this.title}
      </Layout.ViewHeader>
    );
  }
}
