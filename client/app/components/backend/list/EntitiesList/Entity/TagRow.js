import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntityRow from "./Row";

export default class TagRow extends PureComponent {
  static displayName = "EntitiesList.Entity.TagRow";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  get tag() {
    return this.props.entity;
  }

  get id() {
    return this.tag.id;
  }

  get active() {
    return this.props.active === this.id;
  }

  get name() {
    return this.tag.attributes.name;
  }

  render() {
    const additionalProps = {
      title: this.name,
      active: this.active
    };

    return <EntityRow {...this.props} {...additionalProps} />;
  }
}
