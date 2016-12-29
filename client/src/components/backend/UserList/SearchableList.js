import React, { Component, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';
import classnames from 'classnames';

export default class SearchableList extends Component {

  static displayName = "UserList.SearchableList";

  static propTypes = {
    users: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    currentUserId: PropTypes.string,
    active: PropTypes.string // the ID of the selected user
  };

  constructor() {
    super();
    this.renderUserList = this.renderUserList.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.isCurrentUser = this.isCurrentUser.bind(this);
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
        <div className="checkbox-primary">
          <div className="toggle-indicator">
            <i className="manicon manicon-check"></i>
          </div>
        </div>
        <Link to={`/backend/users/${user.id}`}>
          <div>
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
          </div>
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
