import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import classnames from "classnames";

export default class PermissionListItem extends PureComponent {
  static displayName = "Permission.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string,
    linkName: PropTypes.string.isRequired
  };

  roleName(name) {
    switch (name) {
      case "project_editor":
        return "Project Editor";
      case "project_resource_editor":
        return "Metadata Editor";
      case "project_author":
        return "Author";
      default:
        return null;
    }
  }

  renderRoles(entity) {
    const roles = entity.attributes.roleNames;
    return roles.map(role => {
      return <span key={`${entity.id}-${role}`}>{this.roleName(role)}</span>;
    });
  }

  render() {
    const entity = this.props.entity;
    if (!entity) return null;

    const resource = entity.relationships.resource;
    const user = entity.relationships.user;

    const itemClasses = classnames({
      active: this.props.active === entity.id
    });

    return (
      <li key={entity.id} className={itemClasses}>
        <Link to={lh.link(this.props.linkName, resource.id, entity.id)}>
          <header>
            <figure className="avatar">
              <figcaption className="screen-reader-text">
                User Avatar
              </figcaption>
              {user.attributes.avatarStyles.smallSquare ? (
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${
                      user.attributes.avatarStyles.smallSquare
                    })`
                  }}
                />
              ) : (
                <div className="no-image">
                  <i className="manicon manicon-person" aria-hidden="true" />
                </div>
              )}
            </figure>
            <div className="meta">
              <h3 className="name large">
                {user.attributes.firstName} {user.attributes.lastName}
              </h3>
            </div>
          </header>
          <span className="label">{this.renderRoles(entity)}</span>
        </Link>
      </li>
    );
  }
}
