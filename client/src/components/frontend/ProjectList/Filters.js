import React, { Component, PropTypes } from 'react';

export default class ProjectListFilters extends Component {

  static displayName = "ProjectList.Filters";

  static propTypes = {
    updateAction: PropTypes.func
  };

  filterChange = (event) => {
    let filter = {};
    switch (event.target.value) {
      case 'featured':
        filter = { featured: true };
        break;
      case 'notFeatured':
        filter = { featured: false };
        break;
      default:
        filter = {};
        break;
    }
    this.props.updateAction(filter);
  };

  render() {
    return (
      <div className="select-browse">
        <select onChange={ this.filterChange } >
          <option value="all">Show All</option>
          <option value="featured">Featured</option>
          <option value="notFeatured">Not Featured</option>
        </select>
        <i className="manicon manicon-caret-down"></i>
      </div>
    );
  }
}
