import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Utility } from "components/global";
import { HigherOrder } from "containers/global";
import withCurrentUser from "containers/global/HigherOrder/withCurrentUser";
import { List } from "components/backend";
import { Link } from "react-router-dom";
import Authorization from "helpers/authorization";
import get from "lodash/get";
import uniqueId from "lodash/uniqueId";
import omitBy from "lodash/omitBy";
import classnames from "classnames";

export class ListSearchable extends PureComponent {
  static mapStateToProps = state => ({
    authentication: state.authentication
  });

  static displayName = "List.Searchable";

  static propTypes = {
    entities: PropTypes.array,
    listClassName: PropTypes.string,
    singularUnit: PropTypes.string,
    pluralUnit: PropTypes.string,
    pagination: PropTypes.object,
    paginationClass: PropTypes.string,
    paginationClickHandler: PropTypes.func,
    entityComponentProps: PropTypes.object,
    entityComponent: PropTypes.func.isRequired,
    paginationPadding: PropTypes.number,
    newButton: PropTypes.shape({
      text: PropTypes.string,
      path: PropTypes.string,
      type: PropTypes.string,
      authorizedFor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      authorizedTo: PropTypes.string
    }),
    secondaryButton: PropTypes.shape({
      icon: PropTypes.string,
      path: PropTypes.string,
      type: PropTypes.string,
      text: PropTypes.string,
      authorizedFor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      authorizedTo: PropTypes.string
    }),
    authentication: PropTypes.object,
    filterOptions: PropTypes.object,
    sortOptions: PropTypes.array,
    destroyHandler: PropTypes.func,
    filterChangeHandler: PropTypes.func,
    currentUser: PropTypes.object,
    initialFilter: PropTypes.object, // Initial filter is to set filter state from an existing state
    defaultFilter: PropTypes.object // Default filter is what filter is set to when resetSearch() is called
  };

  static defaultProps = {
    entityComponentProps: {},
    newButton: null,
    secondaryButton: null,
    paginationPadding: 3,
    requireAbility: null,
    initialFilter: null
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.authorization = new Authorization();
  }

  componentDidMount() {
    this.searchId = uniqueId("list-search-");
    this.filterId = uniqueId("filter-");
    this.sortId = uniqueId("sort-");
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, "filter") !== get(this.state, "filter")) {
      const filter = omitBy(this.state.filter, value => value === "");
      if (filter.keyword) filter.typeahead = true;
      this.props.filterChangeHandler(filter);
    }
  }

  setFilter = (event, label) => {
    const value = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    filter[label] = value;
    this.setState({ filter });
  };

  initialState(props) {
    if (props.initialFilter) return { filter: props.initialFilter };
    return { filter: {} };
  }

  toggleOptions = event => {
    event.preventDefault();
    this.setState({ showOptions: !this.state.showOptions });
  };

  resetSearch = event => {
    event.preventDefault();
    const resetState = this.props.defaultFilter ? this.props.defaultFilter : {};
    this.setState({ filter: resetState });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  showOptionsButton(props) {
    return !!props.filterOptions || !!props.sortOptions;
  }

  renderOptionsText() {
    if (this.state.showOptions) return `Hide Search Options`;
    return `Show Search Options`;
  }

  // When custom dropdowns are implemented, the direction text can be refactored to be styleable
  renderSortList() {
    if (!this.state.showOptions || !this.props.sortOptions) return null;
    const adjustedOptions = [];
    this.props.sortOptions.forEach(option => {
      const asc = (
        <option key={`${option.value} ASC`} value={`${option.value} asc`}>
          {option.label} A to Z
        </option>
      );
      const desc = (
        <option key={`${option.value} DESC`} value={`${option.value} desc`}>
          {option.label} Z to A
        </option>
      );
      adjustedOptions.push(asc, desc);
    });

    return (
      <div className="select-group">
        <label htmlFor={this.sortId}>Sort By:</label>
        {this.renderSortSelect(adjustedOptions)}
      </div>
    );
  }

  renderFilterList() {
    if (!this.state.showOptions || !this.props.filterOptions) return null;
    return (
      <div className="select-group">
        <label htmlFor={this.filterId}>Filter Results:</label>
        {Object.keys(this.props.filterOptions).map(filter =>
          this.renderFilterSelect(filter)
        )}
      </div>
    );
  }

  renderSortSelect(options) {
    return (
      <div className="select" key="filter[order]">
        <select
          id={this.sortId}
          onChange={event => this.setFilter(event, "order")}
          value={this.state.filter.order || ""}
          data-id={"filter"}
        >
          <option value="">Default</option>
          {options}
        </select>
        <i className="manicon manicon-caret-down" aria-hidden="true" />
      </div>
    );
  }

  renderFilterSelect(filter) {
    return (
      <div className="select" key={filter}>
        <select
          id={this.filterId}
          onChange={event => this.setFilter(event, filter)}
          value={this.state.filter[filter] || ""}
          data-id={"filter"}
        >
          <option value="">{`${filter}:`}</option>
          {this.renderFilterOptions(this.props.filterOptions[filter])}
        </select>
        <i className="manicon manicon-caret-down" aria-hidden="true" />
      </div>
    );
  }

  renderFilterOptions(filter) {
    const options = filter.options || filter;
    const out = [];
    options.map(option => {
      const label = this.renderOptionLabel(option, filter);
      return out.push(
        <option key={option} value={option}>
          {label}
        </option>
      );
    });
    return out;
  }

  renderOptionLabel(option, filter) {
    if (!filter.labels || !filter.labels[option]) return option;
    return filter.labels[option];
  }

  renderSearchOptions() {
    if (!this.state.showOptions) return null;
    return (
      <div className="form-list-filter">
        {this.renderFilterList()}
        {this.renderSortList()}
      </div>
    );
  }

  renderButton(buttonProps) {
    if (!buttonProps) return null;

    const buttonIcon = buttonProps.icon ? buttonProps.icon : "manicon-plus";

    const button = (
      <Link
        to={buttonProps.path}
        className={`button-icon-secondary ${buttonProps.type || ""}`}
      >
        <i className={`manicon ${buttonIcon}`} aria-hidden="true" />
        {buttonProps.text}
      </Link>
    );

    if (buttonProps.authorizedFor)
      return (
        <HigherOrder.Authorize
          entity={buttonProps.authorizedFor}
          ability={buttonProps.authorizedTo || "create"}
        >
          {button}
        </HigherOrder.Authorize>
      );
    return button;
  }

  renderButtonRow(props) {
    let newButtonAuthorized = null;
    let secondaryButtonAuthorized = null;

    if (props.newButton && props.newButton.authorizedFor) {
      newButtonAuthorized = this.authorization.authorizeAbility({
        currentUser: props.currentUser,
        entity: props.newButton.authorizedFor,
        ability: props.newButton.authorizedTo || "create"
      });
    }

    if (props.secondaryButton && props.secondaryButton.authorizedFor) {
      secondaryButtonAuthorized = this.authorization.authorizeAbility({
        currentUser: props.currentUser,
        entity: props.secondaryButton.authorizedFor,
        ability: props.secondaryButton.authorizedTo || "create"
      });
    }

    if (!newButtonAuthorized && !secondaryButtonAuthorized) return null;
    return (
      <div className="buttons-icon-horizontal">
        {this.renderButton(props.newButton)}
        {this.renderButton(props.secondaryButton)}
      </div>
    );
  }

  renderEntityList = () => {
    const entities = this.props.entities;
    if (!entities) return;

    return (
      <div>
        <Utility.EntityCount
          pagination={this.props.pagination}
          singularUnit={this.props.singularUnit}
          pluralUnit={this.props.pluralUnit}
        />
        {this.renderButtonRow(this.props)}
        {entities.length > 0 ? (
          <List.SimpleList
            entities={entities}
            entityComponent={this.props.entityComponent}
            entityComponentProps={this.props.entityComponentProps}
            destroyHandler={this.props.destroyHandler}
          />
        ) : (
          <p className="list-total empty">Sorry, no results were found.</p>
        )}
      </div>
    );
  };

  render() {
    const listClassName = classnames(
      "vertical-list-primary",
      this.props.listClassName
    );

    return (
      <div>
        <form className="form-search-filter" onSubmit={this.handleSubmit}>
          <div className="search">
            <button>
              <i className="manicon manicon-magnify" aria-hidden="true" />
              <span className="screen-reader-text">Click to search</span>
            </button>
            <label htmlFor={this.searchId} className="screen-reader-text">
              Enter Search Criteria
            </label>
            <input
              id={this.searchId}
              value={this.state.filter.keyword || ""}
              type="text"
              placeholder="Search..."
              onChange={e => this.setFilter(e, "keyword")}
            />
          </div>
          {this.renderSearchOptions()}
          <div className="button-row">
            {this.showOptionsButton(this.props) ? (
              <button
                onClick={this.toggleOptions}
                className="button-bare-primary"
                data-id={"filter-toggle"}
              >
                {this.renderOptionsText()}
              </button>
            ) : null}
            <button
              onClick={this.resetSearch}
              className="button-bare-primary reset"
            >
              {"Reset Search"}
            </button>
          </div>
        </form>
        <nav className={listClassName}>{this.renderEntityList()}</nav>
        <Utility.Pagination
          pagination={this.props.pagination}
          padding={this.props.paginationPadding}
          paginationClickHandler={this.props.paginationClickHandler}
          level={this.props.paginationClass}
        />
      </div>
    );
  }
}

export default withCurrentUser(ListSearchable);
