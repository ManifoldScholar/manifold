import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import EntityRow from "./Row";

export default class EntitlementRow extends PureComponent {
  static displayName = "EntitiesList.Entity.EntitlementRow";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string,
    linkName: PropTypes.string.isRequired
  };

  get entitlement() {
    return this.props.entity;
  }

  get active() {
    return this.props.active === this.id;
  }

  get currentState() {
    return get(this, "entitlement.attributes.currentState");
  }

  get id() {
    return this.entitlement.id;
  }

  get label() {
    const labels = [this.currentState];
    return labels;
  }

  get target() {
    return get(this, "entitlement.relationships.target");
  }

  get targetName() {
    return get(this, "entitlement.attributes.targetName");
  }

  get targetType() {
    return get(this, "entitlement.attributes.targetType");
  }

  get title() {
    return this.targetName;
  }

  get subtitle() {
    if (this.entitlement.attributes.expiration) {
      return `Expires ${this.entitlement.attributes.expiration}`;
    }
    return null;
  }

  get utility() {
    return (
      <button
        className="entity-row__utility-button"
        onClick={this.onDelete}
        title="Publish feature"
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    );
  }

  onDelete = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDelete(this.entitlement);
  };

  render() {
    const { active, title, label } = this;

    const rowProps = { ...this.props, active, title, label };
    const subtitleProps = this.subtitle ? { subtitle: this.subtitle } : {};

    if (this.targetType === "User") {
      rowProps.figureSize = "small";
      rowProps.figureShape = "circle";
      rowProps.figure = <EntityThumbnail.User entity={this.target} />;
    }

    if (this.targetType === "ReadingGroup") {
      rowProps.figureSize = "small";
      rowProps.figureShape = "square";
      rowProps.figure = <EntityThumbnail.ReadingGroup entity={this.target} />;
    }

    return (
      <EntityRow {...rowProps} {...subtitleProps} utility={this.utility} />
    );
  }
}
