import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";

import EntityThumbnail from "global/components/entity-thumbnail";
import { EntityRow } from "../list/EntitiesList";

export default class ResourceListItem extends PureComponent {
  static displayName = "Resource.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string
  };

  get resource() {
    return this.props.entity;
  }

  get id() {
    return this.resource.id;
  }

  get kind() {
    return this.resource.attributes.kind;
  }

  get title() {
    return this.resource.attributes.titleFormatted;
  }

  get createdAt() {
    return this.resource.attributes.createdAt;
  }

  render() {
    return (
      <EntityRow
        onRowClick={lh.link("backendResource", this.id)}
        title={this.title}
        label={this.kind}
        meta={
          <FormattedDate
            prefix="Created"
            format="MMMM DD, YYYY"
            date={this.createdAt}
          />
        }
        figure={<EntityThumbnail.Resource entity={this.resource} />}
      />
    );
  }
}
