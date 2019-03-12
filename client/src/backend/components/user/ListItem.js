import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";

export default class UserListItem extends PureComponent {
  static displayName = "User.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    currentUserId: PropTypes.string,
    active: PropTypes.string
  };

  isCurrentUser(id) {
    let output = "";
    if (this.props.currentUserId === id) {
      output = <span className="specifier">{"You"}</span>;
    }
    return output;
  }

  render() {
    const user = this.props.entity;
    const attr = user.attributes;
    const rowClasses = classnames("user-list-item", {
      active: this.props.active === user.id
    });
    return (
      <li key={user.id} className={rowClasses}>
        {/* Add .checked to .checkbox-primary to display checked state.
            Disabled until functionality is implemented. */}
        {/* <div className="checkbox-primary">
          <div className="toggle-indicator" aria-hidden="true">
            <i className="manicon manicon-check" />
          </div>
        </div> */}
        <Link to={lh.link("backendRecordsUser", user.id)}>
          <header>
            <figure className="avatar">
              <figcaption className="screen-reader-text">
                User Avatar
              </figcaption>
              {attr.avatarStyles.smallSquare ? (
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${attr.avatarStyles.smallSquare})`
                  }}
                />
              ) : (
                <div className="no-image">
                  <i className="manicon manicon-person" aria-label="hidden" />
                </div>
              )}
            </figure>
            <div className="meta">
              <span className="name large">
                {attr.firstName} {attr.lastName}
              </span>
            </div>
          </header>
          <span className="label">
            {this.isCurrentUser(user.id)}
            {attr.role.replace(/_/g, " ")}
          </span>
        </Link>
      </li>
    );
  }
}
