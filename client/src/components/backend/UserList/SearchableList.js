import React, { Component, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';
import classnames from 'classnames';
import get from 'lodash/get';

export default class SearchableList extends Component {

  static displayName = "UserList.SearchableList";

  static propTypes = {
    users: PropTypes.array,
    pagination: PropTypes.object,
    filterChangeHandler: PropTypes.func,
    paginationClickHandler: PropTypes.func,
    currentUserId: PropTypes.string,
    active: PropTypes.string // the ID of the selected user
  };

  constructor() {
    super();

    this.state = this.initialState();

    this.renderUserList = this.renderUserList.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
    this.isCurrentUser = this.isCurrentUser.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, 'filter.keyword') !== get(this.state, 'filter.keyword')) {
      this.props.filterChangeHandler(this.state.filter);
    }
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

  resetSearch(event) {
    event.preventDefault();
    this.setState(this.initialState());
  }

  initialState() {
    return {
      inputs: { keyword: "" },
      filter: { }
    };
  }

  isCurrentUser(id) {
    let output = '';
    if (this.props.currentUserId === id) {
      output = (
        <span className="specifier">
          {'You'}
        </span>
      );
    }
    return output;
  }

  renderUser(user) {
    const attr = user.attributes;
    const rowClasses = classnames({ active: this.props.active === user.id });
    return (
      <li key={user.id} className={rowClasses} >
        {/* Add .checked to .checkbox-primary to display checked state */}
        <div className="checkbox-primary">
          <div className="toggle-indicator">
            <i className="manicon manicon-check"></i>
          </div>
        </div>
        <Link to={`/backend/users/${user.id}`}>
          <header>
            <figure className="avatar">
              {attr.avatarUrl ?
                <div className="image" style={ { backgroundImage: `url(${attr.avatarUrl})` } }/>
                :
                <div className="no-image">
                  <i className="manicon manicon-person"></i>
                </div>
              }
            </figure>
            <div className="meta">
              <h3 className="name large">
                {attr.firstName} {attr.lastName}
              </h3>
            </div>
          </header>
          <span className="label">
            {this.isCurrentUser(user.id)}
            {attr.role}
          </span>
        </Link>
      </li>
    );
  }

  renderUserList() {
    const users = this.props.users;
    let output = null;
    if (users.length > 0) {
      output = (
        <div>
          <Utility.EntityCount
            pagination={this.props.pagination}
            singularUnit="user"
            pluralUnit="users"
          />
          <ul>
            {users.map((user) => {
              return this.renderUser(user);
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
          {this.renderUserList()}
        </nav>
        <Utility.Pagination
          pagination={this.props.pagination}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
