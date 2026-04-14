import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import isBoolean from "lodash/isBoolean";

export default class ListEntitiesListSearch extends PureComponent {
  static displayName = "List.Entities.List.Count";

  static propTypes = {
    pagination: PropTypes.object.isRequired,
    showCount: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    unit: PropTypes.string
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

  render() {
    return (
      <div className="entity-list__count">
        {!isBoolean(this.showCount) ? (
          this.showCount
        ) : (
          <Utility.EntityCount pagination={this.pagination} unit={this.unit} />
        )}
      </div>
    );
  }
}
