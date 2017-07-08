import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ProjectListFilters extends Component {
  static displayName = "ProjectList.Filters";

  static propTypes = {
    updateAction: PropTypes.func,
    subjects: PropTypes.array,
    hideFeatured: PropTypes.bool
  };

  filterChange = event => {
    let filter = {};
    const value = event.target.value;
    if (value) {
      switch (value) {
        case "featured":
          filter = { featured: true };
          break;
        case "notFeatured":
          filter = { featured: false };
          break;
        default:
          filter = { subject: value };
          break;
      }
    }
    this.props.updateAction(filter);
  };

  subjectOptions() {
    if (!this.props.subjects) return null;
    return this.props.subjects.map(subject => {
      return (
        <option key={subject.id} value={subject.id}>
          {subject.attributes.name}
        </option>
      );
    });
  }

  featuredOptions() {
    if (this.props.hideFeatured) return null;
    return <option value="featured">Featured Projects</option>;
  }

  render() {
    return (
      <div className="select-browse">
        <select onChange={this.filterChange}>
          <option value="">Show All</option>
          {this.featuredOptions()}
          {this.subjectOptions()}
        </select>
        <i className="manicon manicon-caret-down" />
      </div>
    );
  }
}
