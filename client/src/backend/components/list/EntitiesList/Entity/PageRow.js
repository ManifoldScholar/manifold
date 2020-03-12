import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class PageRow extends PureComponent {
  static displayName = "EntitiesList.Entity.PageRow";

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
        {...this.props}
        onRowClick={this.url}
        rowClickMode="block"
        title={this.title}
        subtitle={this.subtitle}
        label={this.label}
        figure={<EntityThumbnail.Page entity={this.page} />}
      />
    );
  }
}
