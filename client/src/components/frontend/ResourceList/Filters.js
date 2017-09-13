import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";

export default class ResourceListFilters extends Component {
  static displayName = "ResourceList.Filters";

  static propTypes = {
    kinds: PropTypes.array,
    tags: PropTypes.array,
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
    this.setFilters = this.setFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  setFilters(event, label) {
    event.preventDefault();
    const value =
      label === "keyword"
        ? event.target.querySelector(".search-input input").value
        : event.target.value;
    const filter = Object.assign({}, this.state.filter);
    const inputs = Object.assign({}, this.state.inputs);
    if (value && label) {
      switch (value) {
        case "default":
          delete filter[label];
          inputs[label] = "default";
          break;
        default:
          filter[label] = value;
          inputs[label] = value;
          break;
      }
      this.setState({ inputs, filter }, this.updateResults);
    }
  }

  setKeywordInput(event) {
    event.preventDefault();
    const value = event.target.value;
    const inputs = Object.assign({}, this.state.inputs);
    const filter = Object.assign({}, this.state.filter);
    if (value === "") {
      inputs.keyword = "";
      delete filter.keyword;
    } else {
      inputs.keyword = value;
    }
    this.setState({ inputs, filter });
  }

  updateResults() {
    this.props.filterChangeHandler(this.state.filter);
  }

  initialState(init) {
    return {
      filter: init || {},
      inputs: init || {
        keyword: "",
        kind: "default",
        tag: "default",
        order: "default"
      }
    };
  }

  resetFilters(event) {
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  }

  render() {
    return (
      <form
        className="form-list-filter"
        onSubmit={event => this.setFilters(event, "keyword")}
      >
        <div className="search-input">
          <button className="search-button" type="submit">
            <i className="manicon manicon-magnify" />
          </button>
          <input
            value={this.state.inputs.keyword}
            type="text"
            onChange={event => this.setKeywordInput(event)}
            placeholder="Search"
          />
        </div>
        <div className="select-group inline">
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "kind")}
              value={this.state.inputs.kind}
            >
              <option value="default">Type:</option>
              {this.props.kinds
                ? this.props.kinds.map(kind => {
                    return (
                      <option key={kind} value={kind}>
                        {capitalize(kind)}
                      </option>
                    );
                  })
                : null}
            </select>
            <i className="manicon manicon-caret-down" />
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "tag")}
              value={this.state.inputs.tag}
            >
              <option value="default">Tag:</option>
              {this.props.tags
                ? this.props.tags.map(tag => {
                    return (
                      <option key={tag} value={tag}>
                        {capitalize(tag)}
                      </option>
                    );
                  })
                : null}
            </select>
            <i className="manicon manicon-caret-down" />
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "order")}
              value={this.state.inputs.order}
            >
              <option value="default">Order By:</option>
              <option value="title ASC">A-Z</option>
              <option value="title DESC">Z-A</option>
            </select>
            <i className="manicon manicon-caret-down" />
          </div>
        </div>
        <button className="reset-button" onClick={this.resetFilters}>
          {"Reset Search + Filters"}
        </button>
      </form>
    );
  }
}
