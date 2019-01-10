import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Identity from "../parts/Identity";
import Edit from "../parts/Edit";
import Drag from "../parts/Drag";
import Delete from "../parts/Delete";
import VisibilityToggle from "../parts/VisibilityToggle";
import get from "lodash/get";

export default class ProjectContentBlockInListCurrent extends PureComponent {
  static displayName = "Project.Content.Block.InList.Current";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityCallbacks: PropTypes.object.isRequired,
    typeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  get entity() {
    return this.props.entity;
  }

  get configurable() {
    return this.entity.attributes.configurable || false;
  }

  get orderable() {
    return this.entity.attributes.orderable || false;
  }

  get hideable() {
    return this.entity.attributes.hideable || false;
  }

  get deletable() {
    return get(this.entity, "attributes.abilities.delete", false);
  }

  render() {
    const TypeComponent = this.props.typeComponent;
    const baseClass = "content-block";

    return (
      <TypeComponent>
        {block => (
          <div className={`${baseClass}__inner`}>
            <div className="identity">
              <Identity
                icon={block.icon}
                title={`${block.title} [ID: ${this.entity.id}]`}
                size={"large"}
              />
            </div>
            <div className={`${baseClass}__button-list`}>
              <Delete
                visible={this.deletable}
                baseClass={baseClass}
                clickHandler={this.props.entityCallbacks.deleteBlock}
              />
              <VisibilityToggle
                visible={this.hideable}
                entity={this.entity}
                entityCallbacks={this.props.entityCallbacks}
              />
              <Edit
                visible={this.configurable}
                baseClass={baseClass}
                clickHandler={this.props.entityCallbacks.editBlock}
              />
              <Drag
                visible={this.orderable}
                baseClass={baseClass}
                dragHandleProps={this.props.dragHandleProps}
              />
            </div>
          </div>
        )}
      </TypeComponent>
    );
  }
}
