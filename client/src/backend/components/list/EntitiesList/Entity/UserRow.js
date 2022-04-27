import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class UserRow extends PureComponent {
  static displayName = "EntitiesList.Entity.UserRow";

  static propTypes = {
    entity: PropTypes.object,
    currentUserId: PropTypes.string,
    active: PropTypes.string
  };

  get entity() {
    return this.props.entity;
  }

  get attributes() {
    return this.entity.attributes;
  }

  get role() {
    return (
      <>
        {this.isCurrentUser(this.id)}
        {this.attributes.role ? this.attributes.role.replace(/_/g, " ") : null}
      </> // TODO: Translate roles
    );
  }

  get name() {
    const { firstName, lastName } = this.attributes;
    return `${firstName} ${lastName}`;
  }

  get id() {
    return this.entity.id;
  }

  get active() {
    return this.props.active === this.id;
  }

  isCurrentUser(id) {
    let output = "";
    if (this.props.currentUserId === id) {
      output = <span className="specifier">{"You"}</span>;
    }
    return output;
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={lh.link("backendRecordsUser", this.id)}
        rowClickMode="block"
        title={this.name}
        figure={<EntityThumbnail.User entity={this.entity} />}
        figureSize={"small"}
        figureShape={"circle"}
        label={this.role}
        active={this.active}
      />
    );
  }
}
