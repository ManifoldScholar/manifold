import React, { Component, PropTypes } from 'react';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

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

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, 'filter') !== get(this.state, 'filter')) {
      this.props.filterChangeHandler(this.state.filter);
    }
  }

  setFilters(event, label) {
    event.preventDefault();
    const value = (label === "keyword")
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

  initialState(init) {
    return {
      filter: {
      },
      inputs: init ? init : {
        keyword: "",
        kind: "default",
        tag: "default",
        order: "default"
      }
    };
  }

  resetFilters(event) {
    event.preventDefault();
    this.setState(this.initialState());
  }

  render() {
    return (
      <form
        className="form-list-filter"
        onSubmit={event => this.setFilters(event, "keyword")}
      >
        <div className="search-input">
          <button className="search-button" type="submit">
            <i className="manicon manicon-magnify"></i>
          </button>
          <input
            value={this.state.inputs.keyword}
            type="text"
            onChange={event => this.setKeywordInput(event)}
            placeholder="Search"
          />
        </div>
        <div className="select-group">
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "kind")}
              value={this.state.inputs.kind}
            >
              <option value="default">
                Type:
              </option>
              {this.props.kinds ?
                this.props.kinds.map((kind, index) => {
                  return (
                    <option key={index} value={kind}>{capitalize(kind)}</option>
                  );
                })
              : null}
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "tag")}
              value={this.state.inputs.tag}
            >
              <option value="default">
                Tag:
              </option>
              {this.props.tags ?
                this.props.tags.map((tag, index) => {
                  return (
                    <option key={index} value={tag}>{capitalize(tag)}</option>
                  );
                })
              : null}
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "order")}
              value={this.state.inputs.order}
            >
              <option value="default">
                Order By:
              </option>
              <option value="title ASC">A-Z</option>
              <option value="title DESC">Z-A</option>
            </select>
            <i className="manicon manicon-caret-down"></i>
          </div>
        </div>
        <button className="reset-button" onClick={this.resetFilters}>
          {'Reset Search + Filters'}
        </button>
      </form>
    );
  }
}
