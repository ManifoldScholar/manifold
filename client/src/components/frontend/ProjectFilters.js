import React, { Component, PropTypes } from 'react';

export default class ProjectFilters extends Component {

  static propTypes = {
    updateAction: PropTypes.func
  };

  filterChange(event) {
    let filter = {};
    switch (event.target.value) {
      case 'featured':
        filter = {featured: true};
        break;
      case 'notFeatured':
        filter = {featured: false};
        break;
      default:
        filter = {};
        break;
    }
    this.props.updateAction(filter);
  }

  render() {
    return (
      <div className="select-browse" style={{marginBottom: 93}}>
        <select onChange={this.filterChange.bind(this)} >
          <option value="all">Show All</option>
          <option value="featured">Featured</option>
          <option value="notFeatured">Not Featured</option>
        </select>
        <i className="manicon manicon-caret-down"></i>
      </div>
    );
  }
}
