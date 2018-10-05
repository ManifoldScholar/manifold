import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { HigherOrder } from "containers/global";
import { Form } from "components/backend";
import uniqueId from "lodash/uniqueId";

export default class ProjectCollectionSortBy extends PureComponent {
  static displayName = "ProjectCollection.SortBy";

  static propTypes = {
    projectCollection: PropTypes.object,
    sortChangeHandler: PropTypes.func.isRequired,
    sortId: PropTypes.string
  };

  static defaultProps = {
    sortId: uniqueId("collection-sort-")
  };

  isManualSort(projectCollection) {
    if (!projectCollection) return false;
    return projectCollection.attributes.manuallySorted;
  }

  handleClick = event => {
    event.preventDefault();
    const manual = this.isManualSort(this.props.projectCollection);
    const order = manual ? "created_at_asc" : "manual";
    return this.props.sortChangeHandler(order);
  };

  handleChange = event => {
    event.preventDefault();
    const order = event.target.value;
    return this.props.sortChangeHandler(order);
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  renderSortList(projectCollection) {
    if (this.isManualSort(projectCollection))
      return (
        <div className="instructional-copy">
          Click and drag projects to rearrange them.
        </div>
      );
    const selected = projectCollection.attributes.sortOrder;

    return (
      <div className="select-group">
        <label htmlFor={this.props.sortId}>Order Collection By:</label>
        <div className="select" key="filter[order]">
          <select
            id={this.props.sortId}
            onChange={this.handleChange}
            value={selected}
            data-id={"filter"}
          >
            <option key="created_at_asc" value="created_at_asc">
              Newest
            </option>
            <option key="updated_at_desc" value="updated_at_desc">
              Recently Updated
            </option>
            <option key="title_asc" value="title_asc">
              title A to Z
            </option>
            <option key="title_desc" value="title_desc">
              title Z to A
            </option>
          </select>
          <i className="manicon manicon-caret-down" aria-hidden="true" />
        </div>
      </div>
    );
  }

  renderToggle(projectCollection) {
    if (projectCollection.attributes.smart) return null;
    const toggled = this.isManualSort(projectCollection);

    const classes = classnames({
      "boolean-primary": true,
      checked: toggled
    });

    return (
      <form className="form-secondary">
        <div className="form-input">
          <h4 className="form-input-heading">Order Manually</h4>
          <div className="toggle-indicator">
            <div
              onClick={this.handleClick}
              className={classes}
              role="button"
              tabIndex="0"
              aria-pressed={toggled}
            >
              <span className="screen-reader-text">
                Order collection manually
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  }

  render() {
    if (!this.props.projectCollection) return null;

    return (
      <div className="project-collection-sort form-flex">
        <form className="form-search-filter" onSubmit={this.handleSubmit}>
          <div className="form-list-filter">
            {this.renderSortList(this.props.projectCollection)}
          </div>
        </form>
        {this.renderToggle(this.props.projectCollection)}
      </div>
    );
  }
}
