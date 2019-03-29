import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.ResourceCollectionRow";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string,
    active: PropTypes.string,
    onRowClick: PropTypes.func
  };

  get onRowClick() {
    if (this.props.onRowClick)
      return event => {
        event.preventDefault();
        event.stopPropagation();
        return this.props.onRowClick(this.resourceCollection);
      };
    return lh.link("backendResourceCollection", this.id);
  }

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
        {...this.props}
        onRowClick={this.onRowClick}
        rowClickMode="block"
        title={this.title}
        count={this.count}
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
