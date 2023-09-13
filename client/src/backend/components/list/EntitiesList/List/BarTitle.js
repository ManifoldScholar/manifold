import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PageHeader from "backend/components/layout/PageHeader";
import isNil from "lodash/isNil";

export default class ListEntitiesListBarTitle extends PureComponent {
  static displayName = "List.Entities.List.BarTitle";

  static propTypes = {
    title: PropTypes.node,
    titleIcon: PropTypes.string,
    titleLink: PropTypes.string,
    count: PropTypes.node,
    titleTag: PropTypes.string
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
      <PageHeader
        icon={this.titleIcon}
        count={this.count}
        titleTag={this.props.titleTag}
        title={this.title}
        type={this.count || this.props.titleTag ? "count" : "list"}
        hideBreadcrumbs={this.props.titleTag === "h2"}
        actions={this.props.titleActions}
      />
    );
  }
}
