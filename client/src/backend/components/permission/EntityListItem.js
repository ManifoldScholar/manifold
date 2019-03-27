import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { EntityRow } from "backend/components/list/EntitiesList";
import EntityThumbnail from "global/components/entity-thumbnail";

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

  roles() {
    return this.permission.attributes.roleNames.map(role =>
      this.roleName(role)
    );
  }

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

  render() {
    return (
      <EntityRow
        onRowClick={this.url}
        title={this.title}
        label={this.roles()}
        listStyle={this.props.listStyle}
        figure={<EntityThumbnail.User entity={this.user} />}
        figureSize={"small"}
        figureShape={"circle"}
      />
    );
  }
}
