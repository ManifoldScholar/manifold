import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { ListFilters } from "global/components/list";

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

  get filters() {
    return [
      {
        label: "Order Collection By:",
        value: this.sortOrder,
        onChange: this.handleChange,
        options: [
          { label: "Date Created (Newest First)", value: "created_at_desc" },
          { label: "Date Created (Oldest First)", value: "created_at_asc" },
          { label: "Last Updated (Newest First)", value: "updated_at_desc" },
          { label: "Last Updated (Oldest First)", value: "updated_at_asc" },
          { label: "Title A to Z", value: "title_asc" },
          { label: "Title Z to A", value: "title_desc" },
          {
            label: "Publication Date (Newest First)",
            value: "publication_date_desc"
          },
          {
            label: "Publication Date (Oldest First)",
            value: "publication_date_asc"
          }
        ]
      }
    ];
  }

  handleClick = event => {
    event.preventDefault();
    const order = this.isManualSort ? "created_at_asc" : "manual";
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
      <div className="project-collection-sort__instructional-copy">
        Click and drag projects to rearrange them.
      </div>
    );
  }

  render() {
    if (!this.props.projectCollection) return null;

    return (
      <div className="project-collection-sort">
        {this.isManualSort && this.renderManualInstructions()}
        {!this.isManualSort && (
          <ListFilters filters={this.filters} onSubmit={this.handleSubmit} />
        )}
        {this.renderToggle()}
      </div>
    );
  }
}
