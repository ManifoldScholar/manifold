import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { EntityRow } from "backend/components/list/EntitiesList";

export default class TwitterQueryListItem extends PureComponent {
  static displayName = "TwitterQuery.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  get projectId() {
    return this.entity.relationships.project.id;
  }

  get entity() {
    return this.props.entity;
  }

  get id() {
    return this.entity.id;
  }

  get name() {
    return this.entity.attributes.query;
  }

  get label() {
    return this.entity.attributes.active ? "Active" : "Inactive";
  }

  get count() {
    const { eventsCount } = this.entity.attributes;
    if (eventsCount === 0) return "No tweets have been fetched yet.";
    return `${this.entity.attributes.eventsCount} Tweets fetched`;
  }

  get active() {
    return this.props.active === this.id;
  }

  render() {
    return (
      <EntityRow
        onRowClick={lh.link(
          "backendProjectSocialTwitterQuery",
          this.projectId,
          this.id
        )}
        figureSize={"small"}
        title={this.name}
        meta={this.count}
        label={this.label}
        active={this.active}
      />
    );
  }
}
