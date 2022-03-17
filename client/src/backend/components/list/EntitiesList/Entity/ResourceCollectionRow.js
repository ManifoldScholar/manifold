import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class ResourceCollectionRow extends PureComponent {
  static displayName = "EntitiesList.Entity.ResourceCollectionRow";

  static propTypes = {
    entity: PropTypes.object,
    clickable: PropTypes.bool,
    projectId: PropTypes.string,
    active: PropTypes.string,
    onRowClick: PropTypes.func
  };

  static defaultProps = {
    clickable: true
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

  get isInWell() {
    return this.props.listStyle === "well";
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
    return `${count} ${count === 1 ? "resource" : "resources"}`;
  }

  get createdAt() {
    return this.resourceCollection.attributes.createdAt;
  }

  render() {
    const linkProps = this.props.clickable
      ? {
          onRowClick: this.onRowClick,
          rowClickMode: "block"
        }
      : {};
    return (
      <EntityRow
        {...this.props}
        {...linkProps}
        title={this.title}
        count={this.count}
        meta={
          !this.isInWell && (
            <FormattedDate
              prefix="Created"
              format="PPP"
              date={this.createdAt}
            />
          )
        }
        figure={
          !this.isInWell && (
            <EntityThumbnail.ResourceCollection
              entity={this.resourceCollection}
            />
          )
        }
        active={this.active}
      />
    );
  }
}
