import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import BarTitle from "./BarTitle";
import SectionTitle from "./SectionTitle";
import TextTitle from "./TextTitle";

export default class ListEntitiesListTitle extends PureComponent {
  static displayName = "List.Entities.List.Title";

  static propTypes = {
    title: PropTypes.node,
    titleIcon: PropTypes.string,
    titleLink: PropTypes.string,
    titleStyle: PropTypes.oneOf(["bar", "title", "section"]),
    pagination: PropTypes.object,
    showCount: PropTypes.bool,
    titleTag: PropTypes.string,
    titleActions: PropTypes.arrayOf(PropTypes.object)
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

  get titleLink() {
    return this.props.titleLink;
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
        titleLink={this.titleLink}
        count={this.count}
        title={this.title}
        titleIcon={this.titleIcon}
        titleTag={this.props.titleTag}
        titleActions={this.props.titleActions}
      />
    );
  }
}
