import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import truncate from "lodash/truncate";
import EntityRow from "./Row";
import EntityThumbnail from "global/components/entity-thumbnail";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.FeatureRow";

  static propTypes = {
    entity: PropTypes.object
  };

  get feature() {
    return this.props.entity;
  }

  get id() {
    return this.feature.id;
  }

  get createdAt() {
    return this.feature.attributes.createdAt;
  }

  get live() {
    return this.feature.attributes.live;
  }

  get header() {
    return this.feature.attributes.header;
  }

  get position() {
    return this.feature.attributes.position;
  }

  get url() {
    return lh.link("backendRecordsFeature", this.id);
  }

  get name() {
    return truncate(this.header || `Untitled #${this.position}`, {
      length: 60
    });
  }

  get label() {
    if (this.live) return "published";
    return null;
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={this.url}
        rowClickMode="block"
        title={this.name}
        meta={
          <FormattedDate
            prefix="Added"
            format="MMMM, YYYY"
            date={this.createdAt}
          />
        }
        label={this.label}
        figure={<EntityThumbnail.Feature entity={this.feature} />}
      />
    );
  }
}
