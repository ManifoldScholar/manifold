import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import isNil from "lodash/isNil";
import { Link } from "react-router-dom";

export default class ListEntitiesListTextTitle extends PureComponent {
  static displayName = "List.Entities.List.TextTitle";

  static propTypes = {
    titleIcon: PropTypes.string,
    titleLink: PropTypes.string,
    title: PropTypes.node,
    count: PropTypes.number
  };

  static defaultProps = {};

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

  get titleIcon() {
    return this.props.titleIcon;
  }

  get titleLink() {
    return this.props.titleLink;
  }

  link(child) {
    if (!this.titleLink) return child;
    return <Link to={this.titleLink}>{child}</Link>;
  }

  render() {
    return (
      <h3 className="entity-list__title-block entity-list__title">
        {this.link(
          <React.Fragment>
            {this.titleIcon && (
              <figure className="entity-list__title-icon">
                <Utility.IconComposer icon={this.titleIcon} />
              </figure>
            )}
            {this.title}
          </React.Fragment>
        )}
      </h3>
    );
  }
}
