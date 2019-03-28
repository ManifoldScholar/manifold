import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { EntityRow } from "backend/components/list/EntitiesList";
import EntityThumbnail from "global/components/entity-thumbnail";

export default class PageListItem extends PureComponent {
  static displayName = "Page.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  get page() {
    return this.props.entity;
  }

  get id() {
    return this.page.id;
  }

  get url() {
    return lh.link("backendRecordsPage", this.id);
  }

  get title() {
    return this.page.attributes.title;
  }

  get subtitle() {
    const { isExternalLink, externalLink, slug } = this.page.attributes;
    return isExternalLink ? externalLink : `/page/${slug}`;
  }

  get label() {
    const { purpose } = this.page.attributes;
    return purpose.replace(/_/g, " ");
  }

  render() {
    return (
      <EntityRow
        onRowClick={this.url}
        title={this.title}
        subtitle={this.subtitle}
        label={this.label}
        figure={<EntityThumbnail.Page entity={this.page} />}
      />
    );
  }
}
