import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { EntityRow } from "backend/components/list/EntitiesList";
import EntityThumbnail from "global/components/entity-thumbnail";

export default class MakerListItem extends PureComponent {
  static displayName = "Maker.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  get maker() {
    return this.props.entity;
  }

  get attributes() {
    return this.maker.attributes;
  }

  get name() {
    const { fullName } = this.attributes;
    return fullName;
  }

  get id() {
    return this.maker.id;
  }

  get url() {
    return lh.link("backendRecordsMaker", this.id);
  }

  get active() {
    return this.props.active === this.id;
  }

  render() {
    return (
      <EntityRow
        onRowClick={this.url}
        title={this.name}
        listStyle={this.props.listStyle}
        figure={<EntityThumbnail.Maker entity={this.maker} />}
        figureSize="small"
        figureShape="circle"
        active={this.active}
      />
    );
  }
}
