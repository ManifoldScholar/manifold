import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import labelId from "helpers/labelId";
import { Collapse } from "react-collapse";
import isNil from "lodash/isNil";
import get from "lodash/get";
import omitBy from "lodash/omitBy";

export default class ListEntitiesListSearch extends PureComponent {
  static displayName = "List.Entities.List.Search";

  static propTypes = {
    filters: PropTypes.array,
    sortOptions: PropTypes.array,
    initialFilter: PropTypes.object,
    defaultFilter: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    filters: [],
    sortOptions: []
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      filter: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, "filter") !== get(this.state, "filter")) {
      const filter = omitBy(this.state.filter, value => value === "");
      if (filter.keyword) filter.typeahead = true;
      this.props.onChange(filter);
    }
  }

  onSubmit = event => {
    event.preventDefault();
  };

  get filters() {
    return this.props.filters || [];
  }

  get sortOptions() {
    return this.props.sortOptions || [];
  }

  get isSortable() {
    return this.sortOptions.length > 0;
  }

  get isFilterable() {
    return this.filters.length > 0;
  }

  get isConfigurable() {
    return this.isSortable || this.isFilterable;
  }

  get keywordFilter() {
    return { key: "keyword" };
  }

  get sortFilter() {
    return { key: "order" };
  }

  setFilterValue(event, { key }) {
    const value = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    filter[key] = value;
    this.setState({ filter });
  }

  getFilterValue(filter) {
    const value = this.state.filter[filter.key];
    if (isNil(value)) return "";
    return value;
  }

  toggleOptions = event => {
    event.preventDefault();
    this.setState({ open: !this.state.open });
  };

  resetSearch = event => {
    event.preventDefault();
    const resetState = this.props.defaultFilter ? this.props.defaultFilter : {};
    this.setState({ filter: resetState });
  };

  /* eslint-disable react/no-array-index-key */
  /* these filters never change after render */
  render() {
    const label = labelId("list-search-");
    const baseClass = "entity-list-search";

    return (
      <div className={`entity-list__search ${baseClass}`}>
        <form onSubmit={this.onSubmit}>
          <div className={`${baseClass}__keyword-row`}>
            <button className={`${baseClass}__search-button`}>
              <Utility.IconComposer
                iconClass="manicon-magnify"
                icon="search16"
              />
              <span className="screen-reader-text">Search</span>
            </button>
            <div className={`${baseClass}__keyword-input-wrapper`}>
              <label htmlFor={label} className="screen-reader-text">
                Enter Search Criteria
              </label>
              <input
                className={`${baseClass}__keyword-input`}
                id={label}
                value={this.getFilterValue(this.keywordFilter)}
                type="text"
                placeholder="Search..."
                onChange={e => this.setFilterValue(e, this.keywordFilter)}
              />
            </div>
            <button
              onClick={this.resetSearch}
              className={`${baseClass}__text-button`}
            >
              Reset
            </button>
            {this.isConfigurable && (
              <button
                onClick={this.toggleOptions}
                className={`${baseClass}__text-button ${baseClass}__text-button--foregrounded`}
              >
                Options
              </button>
            )}
          </div>
        </form>
        {this.isConfigurable && (
          <Collapse
            isOpened={this.state.open}
            springConfig={{ stiffness: 390, damping: 50 }}
          >
            <div>
              <div className={`${baseClass}__options`}>
                {this.filters.map((filter, i) => (
                  <div key={i} className={`${baseClass}__option`}>
                    <div className={`${baseClass}__option-inner`}>
                      <span
                        className={`${baseClass}__options-label ${
                          i > 0 ? `${baseClass}__options-label--empty` : ""
                        }`}
                      >
                        {i === 0 ? "Filter Results:" : "\u00A0"}
                      </span>
                      <div className={`${baseClass}__select-wrapper`}>
                        <select
                          id={labelId("list-search-")}
                          onChange={event => this.setFilterValue(event, filter)}
                          value={this.getFilterValue(filter)}
                        >
                          <option value="">{`Filter by: ${
                            filter.label
                          }`}</option>
                          {filter.options.map((option, optionIndex) => (
                            <option key={optionIndex} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Utility.IconComposer icon="disclosure24" />
                      </div>
                    </div>
                  </div>
                ))}
                {this.isSortable && (
                  <div className={`${baseClass}__option`}>
                    <div className={`${baseClass}__option-inner`}>
                      <span className={`${baseClass}__options-label`}>
                        Sort By:
                      </span>
                      <div className={`${baseClass}__select-wrapper`}>
                        <select
                          id={labelId("list-search-")}
                          onChange={event =>
                            this.setFilterValue(event, this.sortFilter)
                          }
                          value={this.getFilterValue(this.sortFilter)}
                        >
                          <option value="">Default:</option>
                          {this.sortOptions.map((option, optionIndex) => (
                            <option key={optionIndex} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Utility.IconComposer icon="disclosure24" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Collapse>
        )}
      </div>
    );
  }
}
