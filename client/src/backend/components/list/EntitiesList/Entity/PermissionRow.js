import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.PermissionRow";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string,
    linkName: PropTypes.string.isRequired
  };

  get permission() {
    return this.props.entity;
  }

  get resource() {
    return this.permission.relationships.resource;
  }

  get user() {
    return this.permission.relationships.user;
  }

  get id() {
    return this.permission.id;
  }

  get url() {
    lh.link(this.props.linkName, this.resource.id, this.id);
  }

  get title() {
    const { fullName } = this.user.attributes;
    return fullName;
  }

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

  roles() {
    return this.permission.attributes.roleNames.map(role =>
      this.roleName(role)
    );
  }

  render() {
    return (
      <EntityRow
        onRowClick={this.url}
        title={this.title}
        label={this.roles()}
        figure={<EntityThumbnail.User entity={this.user} />}
        figureSize={"small"}
        figureShape={"circle"}
      />
    );
  }
}
