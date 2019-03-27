import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import { EntityRow } from "backend/components/list/EntitiesList";

export default class ResourceCollectionListItem extends PureComponent {
  static displayName = "ResourceCollection.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string
  };

  get resourceCollection() {
    return this.props.entity;
  }

  get id() {
    return this.resourceCollection.id;
  }

  get active() {
    return this.props.active === this.id;
  }

  get title() {
    return this.resourceCollection.attributes.title;
  }

  get count() {
    const {
      collectionResourcesCount: count
    } = this.resourceCollection.attributes;
    return `${count} resources`;
  }

  get createdAt() {
    return this.resourceCollection.attributes.createdAt;
  }

  render() {
    return (
      <EntityRow
        onRowClick={lh.link("backendResourceCollection", this.id)}
        title={this.title}
        count={this.count}
        listStyle={this.props.listStyle}
        meta={
          <FormattedDate
            prefix="Created"
            format="MMMM DD, YYYY"
            date={this.createdAt}
          />
        }
        figure={
          <EntityThumbnail.ResourceCollection
            entity={this.resourceCollection}
          />
        }
        active={this.active}
      />
    );
  }
}
