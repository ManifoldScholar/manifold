import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import truncate from "lodash/truncate";
import { EntityRow } from "backend/components/list/EntitiesList";
import EntityThumbnail from "global/components/entity-thumbnail";

export default class FeatureListItem extends PureComponent {
  static displayName = "Feature.ListItem";

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
    lh.link("backendRecordsFeature", this.id);
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
        onRowClick={this.url}
        title={this.name}
        meta={
          <FormattedDate
            prefix="Added"
            format="MMMM, YYYY"
            date={this.createdAt}
          />
        }
        label={this.label}
        listStyle={this.props.listStyle}
        figure={<EntityThumbnail.Feature entity={this.feature} />}
      />
    );
  }
}
