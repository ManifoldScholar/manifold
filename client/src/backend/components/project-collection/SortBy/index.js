import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import * as Styled from "./styles";

export default class ProjectCollectionSortBy extends PureComponent {
  static displayName = "ProjectCollection.SortBy";

  static propTypes = {
    projectCollection: PropTypes.object,
    sortChangeHandler: PropTypes.func.isRequired
  };

  get idPrefix() {
    return "collection-sort";
  }

  get projectCollection() {
    return this.props.projectCollection;
  }

  get isManualSort() {
    return this.projectCollection.attributes.manuallySorted;
  }

  get sortOrder() {
    return this.projectCollection.attributes.sortOrder;
  }

  handleClick = event => {
    event.preventDefault();
    const order = this.isManualSort ? "created_at_asc" : "manual";
    return this.props.sortChangeHandler(order);
  };

  renderToggle() {
    if (this.projectCollection.attributes.smart) return null;

    const classes = classnames({
      "boolean-primary": true,
      checked: this.isManualSort
    });

    return (
      <div className="form-secondary">
        <div className="form-input">
          <div className="form-input-heading">Order Manually</div>
          <div className="toggle-indicator">
            <div
              onClick={this.handleClick}
              className={classes}
              role="button"
              tabIndex="0"
              aria-pressed={this.isManualSort}
            >
              <span className="screen-reader-text">
                Order collection manually
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderManualInstructions() {
    return (
      <Styled.Instructions>
        Click and drag projects to rearrange them.
      </Styled.Instructions>
    );
  }

  render() {
    if (!this.props.projectCollection) return null;

    return (
      <Styled.Wrapper>
        {this.isManualSort && this.renderManualInstructions()}
        {!this.isManualSort && (
          <Styled.ListFilters
            onFilterChange={this.props.sortChangeHandler}
            init={{ sortBy: this.sortOrder }}
            options={{ orderCollection: true, hideSearch: true }}
          />
        )}
        {this.renderToggle()}
      </Styled.Wrapper>
    );
  }
}
