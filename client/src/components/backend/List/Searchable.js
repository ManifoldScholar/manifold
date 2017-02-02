import React, { PureComponent, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';
import get from 'lodash/get';

export default class ListSearchable extends PureComponent {

  static displayName = "List.Searchable";

  static propTypes = {
    entities: PropTypes.array,
    singularLabel: PropTypes.string,
    pluralLabel: PropTypes.string,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  static defaultProps = {
    entityComponentProps: {}
  }

  constructor() {
    super();

    this.state = this.initialState();
    this.setKeyword = this.setKeyword.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.renderEntityList = this.renderEntityList.bind(this);
    this.renderEntity = this.renderEntity.bind(this);
  }

  initialState() {
    return {
      inputs: { keyword: "" },
      filter: { }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, 'filter.keyword') !== get(this.state, 'filter.keyword')) {
      this.props.filterChangeHandler(this.state.filter);
    }
  }

  resetSearch(event) {
    event.preventDefault();
    this.setState(this.initialState());
  }

  setKeyword(event) {
    const keyword = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    if (keyword === "") {
      delete filter.keyword;
      delete filter.typeahead;
    } else {
      filter.keyword = keyword;
      filter.typeahead = true;
    }
    this.setState({ inputs: { keyword }, filter });
  }

  renderEntity(entity) {
    const props = Object.assign({}, this.props.entityComponentProps);
    props.key = entity.id;
    props.entity = entity;
    return React.createElement(this.props.entityComponent, props);
  }

  renderEntityList() {
    const entities = this.props.entities;
    if (!entities) return;

    let output = null;

    if (entities.length > 0) {
      output = (
        <div>
          <Utility.EntityCount
            pagination={this.props.pagination}
            singularUnit={this.props.singularUnit}
            pluralUnit={this.props.pluralUnit}
          />
          <ul>
            {entities.map((entity) => {
              return this.renderEntity(entity);
            })}
          </ul>
        </div>
      );
    } else {
      output = (
        <p className="list-total">Sorry, no results were found.</p>
      );
    }

    return output;
  }

  render() {
    return (
      <div>
        <form className="form-search-filter">
          <div className="search">
            <button>
              <i className="manicon manicon-magnify"></i>
              <span className="screen-reader-text">Click to search</span>
            </button>
            <input
              value={this.state.inputs.keyword}
              type="text"
              placeholder="Search..."
              onChange={this.setKeyword}
            />
          </div>
          <button
            onClick={this.resetSearch}
            className="button-bare-primary reset"
          >
            {'Reset Search'}
          </button>
        </form>
        <nav className="vertical-list-primary">
          {this.renderEntityList()}
        </nav>
        <Utility.Pagination
          pagination={this.props.pagination}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
