import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import typeResolver from "./helpers/resolver";
import { Incomplete } from "frontend/components/content-block/Block/parts";
import Authorization from "helpers/authorization";
import EntityCollection from "global/components/composed/EntityCollection/EntityCollection";

export default class ProjectContentBlock extends PureComponent {
  static displayName = "Project.Content.Block";

  static propTypes = {
    project: PropTypes.object,
    block: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  get title() {
    return this.block.attributes.title || this.typeComponent.title;
  }

  get icon() {
    return this.typeComponent.icon;
  }

  get placeholderTitle() {
    return this.typeComponent.placeholderTitle || this.typeComponent.title;
  }

  get description() {
    return (
      this.block.attributes.descriptionFormatted ||
      this.block.attributes.description
    );
  }

  get block() {
    return this.props.block;
  }

  get bgColor() {
    return this.block.attributes.style === "shaded" ? "neutral05" : "white";
  }

  get renderable() {
    return this.block.attributes.renderable;
  }

  get visible() {
    return this.block.attributes.visible;
  }

  get canUpdate() {
    return this.authorization.authorizeAbility({
      entity: this.block,
      ability: "update"
    });
  }

  get type() {
    return this.block.attributes.type;
  }

  get typeComponent() {
    return typeResolver.typeToBlockComponent(this.type);
  }

  get showBlock() {
    if (this.renderable) return true;
    if (!this.canUpdate) return false;
    return this.visible;
  }

  render() {
    if (!this.showBlock) return null;

    const title = this.renderable ? this.title : this.placeholderTitle;
    const TypeComponent = this.typeComponent;

    return (
      <EntityCollection
        title={title}
        icon={this.icon}
        description={this.description}
        UtilityComponent={() => <></>}
        BodyComponent={() =>
          this.renderable ? (
            <TypeComponent {...this.props} />
          ) : (
            <Incomplete block={this.block} />
          )
        }
        bgColor={this.bgColor}
      />
    );
  }
}
