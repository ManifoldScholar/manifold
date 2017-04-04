import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default class ResourceListItem extends PureComponent {

  static displayName = "Resource.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

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

  render() {
    const user = this.props.entity;
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
        <Link to={`/backend/people/users/${user.id}`}>
          <header>
            <figure className="avatar">
              {attr.avatarStyles.smallSquare ?
                <div
                  className="image"
                  style={ { backgroundImage: `url(${attr.avatarStyles.smallSquare})` } }
                />
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

}
