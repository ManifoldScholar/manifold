import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import capitalize from 'lodash/capitalize';

export default class ResourceListFilters extends Component {

  static displayName = "ResourceList.Filters";

  static propTypes = {
    kinds: PropTypes.array
  };

  constructor() {
    super();
  }

  render() {
    return (
      <form className="form-list-filter">
        <div className="search-input">
          <button className="search-button" type="submit">
            <i className="manicon manicon-magnify"></i>
          </button>
          <input type="text" placeholder="Search"/>
        </div>
        <div className="select-group">
          <div className="select">
            <select defaultValue="default">
              <option
                value="default"
                disabled="disabled"
              >
                Type:
              </option>
              {this.props.kinds.map((kind) => {
                return (
                  <option key={kind} value={kind}>{capitalize(kind)}</option>
                );
              })}
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
          <div className="select">
            <select defaultValue="default">
              <option
                value="default"
                disabled="disabled"
              >
                Tag:
              </option>
              <option>Japan</option>
              <option>Photography</option>
              <option>Second Interview</option>
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
          <div className="select">
            <select defaultValue="default">
              <option
                value="default"
                disabled="disabled"
              >
                Sort By:
              </option>
              <option>A-Z</option>
              <option>A-Z</option>
              <option>Z-A</option>
              <option>Upload Date</option>
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
        </div>
        <button className="reset-button">
          {'Reset Search + Filters'}
        </button>
      </form>
    );
  }
}
