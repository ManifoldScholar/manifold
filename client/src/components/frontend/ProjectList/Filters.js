import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ProjectListFilters extends Component {
  static displayName = "ProjectList.Filters";

  static propTypes = {
    updateAction: PropTypes.func,
    params: PropTypes.object,
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
    if (!this.props.subjects || this.props.subjects.length === 0) return null;
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

  defaultValue() {
    if (!this.props.params) return "";
    if (
      this.props.params.featured === true ||
      this.props.params.featured === "true"
    )
      return "featured";
    if (this.props.params.subject) return this.props.params.subject;
    return "";
  }

  render() {
    if (!this.featuredOptions() && !this.subjectOptions()) return null;

    return (
      <div className="select-browse">
        <select defaultValue={this.defaultValue()} onChange={this.filterChange}>
          <option value="">Show All</option>
          {this.featuredOptions()}
          {this.subjectOptions()}
        </select>
        <i className="manicon manicon-caret-down" />
      </div>
    );
  }
}
