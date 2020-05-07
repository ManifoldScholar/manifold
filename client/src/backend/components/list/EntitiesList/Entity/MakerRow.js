import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";

export default class MakerRow extends PureComponent {
  static displayName = "EntitiesList.Entity.MakerRow";

  static propTypes = {
    clickable: PropTypes.bool,
    entity: PropTypes.object,
    active: PropTypes.string,
    withEditButton: PropTypes.bool
  };

  static defaultProps = {
    clickable: true,
    withEditButton: false
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
    const linkProps = this.props.clickable
      ? {
          onRowClick: this.url,
          rowClickMode: "block"
        }
      : {};

    return (
      <EntityRow
        {...this.props}
        {...linkProps}
        title={this.name}
        figure={<EntityThumbnail.Maker entity={this.maker} />}
        figureSize="small"
        figureShape="circle"
        active={this.active}
      />
    );
  }
}
