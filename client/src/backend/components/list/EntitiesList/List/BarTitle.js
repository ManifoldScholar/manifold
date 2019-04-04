import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
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

  figureBlock() {
    return (
      <figure className="backend-header__figure-block">
        <div className="backend-header__figure backend-header__figure--accented">
          <Utility.IconComposer
            icon={this.titleIcon}
            size={34}
            iconClass="backend-header__type-icon backend-header__type-icon--small"
          />
        </div>
      </figure>
    );
  }

  titleBlock() {
    return (
      <div className="backend-header__title-block">
        <h1 className="backend-header__title backend-header__title--large">
          {this.hasCount && (
            <em className="backend-header__emphasis">{this.count} </em>
          )}
          {this.title}
        </h1>
      </div>
    );
  }

  render() {
    return (
      <header className="entity-list__title-block backend-header">
        <div className="backend-header__inner backend-header__inner--narrow">
          <div className="backend-header__content-flex-wrapper">
            {this.titleIcon && this.figureBlock()}
            {this.titleBlock()}
          </div>
        </div>
      </header>
    );
  }
}
