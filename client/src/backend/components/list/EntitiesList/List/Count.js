import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import isBoolean from "lodash/isBoolean";
import isString from "lodash/isString";

export default class ListEntitiesListSearch extends PureComponent {
  static displayName = "List.Entities.List.Count";

  static propTypes = {
    pagination: PropTypes.object.isRequired,
    showCount: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    unit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        singular: PropTypes.string,
        plural: PropTypes.string
      })
    ])
  };

  static defaultProps = {};

  get pagination() {
    return this.props.pagination;
  }

  get unit() {
    return this.props.unit;
  }

  get showCount() {
    return this.props.showCount;
  }

  get singularUnit() {
    if (!this.unit) return null;
    if (isString(this.unit)) return this.unit;
    return this.unit.singular;
  }

  get pluralUnit() {
    if (!this.unit) return null;
    if (isString(this.unit)) return pluralize(this.unit);
    return this.unit.plural;
  }

  render() {
    return (
      <div className="entity-list__count">
        {!isBoolean(this.showCount) ? (
          this.showCount
        ) : (
          <Utility.EntityCount
            pagination={this.pagination}
            singularUnit={this.singularUnit}
            pluralUnit={this.pluralUnit}
          />
        )}
      </div>
    );
  }
}
