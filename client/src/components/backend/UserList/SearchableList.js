import React, { Component, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';

export default class SearchableList extends Component {

  static displayName = "UserList.SearchableList";

  static propTypes = {
    users: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  constructor() {
    super();
    this.renderUserList = this.renderUserList.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  renderUser(user) {
    const attr = user.attributes;

    return (
      <li key={user.id}>
        <Link className="maker" to={`/backend/users/${user.id}`}>
          <figure>
            {attr.avatarUrl ?
              <img
                src={attr.avatarUrl}
              />
              :
              <div className="no-image">
                <i className="manicon manicon-person"></i>
              </div>
            }
          </figure>
          <div className="meta">
            <h3 className="project-title">
              {attr.firstName} {attr.lastName}
            </h3>
          </div>
          <span className="label">
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
          <nav className="maker-utility-list">
            <ul>
              {users.map((user) => {
                return this.renderUser(user);
              })}
            </ul>
          </nav>
        </div>
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
            <input type="text" placeholder="Search..." />
          </div>
          <button className="button-bare-primary">{'More Search Options'}</button>
          <button className="button-bare-primary reset">{'Reset Search'}</button>
        </form>
        <nav className="projects-vertical-primary">
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
