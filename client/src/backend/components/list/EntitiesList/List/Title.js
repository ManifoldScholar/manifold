import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import BarTitle from "./BarTitle";
import SectionTitle from "./SectionTitle";
import TextTitle from "./TextTitle";

export default class ListEntitiesListTitle extends PureComponent {
  static displayName = "List.Entities.List.Title";

  static propTypes = {
    titleIcon: PropTypes.string,
    title: PropTypes.node,
    titleStyle: PropTypes.oneOf(["bar", "title", "section"]),
    pagination: PropTypes.object,
    showCount: PropTypes.bool
  };

  static defaultProps = {
    showCount: false
  };

  get titleStyle() {
    return this.props.titleStyle;
  }

  get pagination() {
    return this.props.pagination;
  }

  get showCount() {
    return this.props.showCount;
  }

  get title() {
    return this.props.title;
  }

  get titleIcon() {
    return this.props.titleIcon;
  }

  get count() {
    if (!this.showCount) return null;
    if (!this.pagination) return null;
    const { totalCount } = this.pagination;
    return totalCount;
  }

  get titleComponent() {
    if (this.titleStyle === "bar") return BarTitle;
    if (this.titleStyle === "section") return SectionTitle;
    return TextTitle;
  }

  render() {
    const TitleComponent = this.titleComponent;
    return (
      <TitleComponent
        count={this.count}
        title={this.title}
        titleIcon={this.titleIcon}
      />
    );
  }
}
