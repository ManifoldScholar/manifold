import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";
import FormSectionLabel from "global/components/form/SectionLabel";

export default class ListEntitiesListSectionTitle extends PureComponent {
  static displayName = "List.Entities.List.SectionTitle";

  static propTypes = {
    title: PropTypes.node,
    titleLink: PropTypes.string,
    titleIcon: PropTypes.string,
    count: PropTypes.node
  };

  get count() {
    return this.props.count;
  }

  get hasCount() {
    return !isNil(this.count);
  }

  get title() {
    const { title } = this.props;
    if (this.hasCount) return `${this.count} ${title}`;
    return title;
  }

  render() {
    return <FormSectionLabel label={this.title} />;
  }
}
