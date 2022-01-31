import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Identity from "../parts/Identity";
import Edit from "../parts/Edit";
import Drag from "../parts/Drag";
import Delete from "../parts/Delete";
import VisibilityToggle from "../parts/VisibilityToggle";
import Authorize from "hoc/Authorize";

export default class ProjectContentBlockInListCurrent extends PureComponent {
  static displayName = "Project.Content.Block.InList.Current";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityCallbacks: PropTypes.object.isRequired,
    typeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    dragHandleProps: PropTypes.object
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

  get renderable() {
    return this.entity.attributes.renderable || false;
  }

  get visible() {
    return this.entity.attributes.visible || true;
  }

  render() {
    const TypeComponent = this.props.typeComponent;
    const baseClass = "backend-content-block";

    return (
      <TypeComponent>
        {block => (
          <div className={`${baseClass}__inner`}>
            <Identity
              icon={block.icon}
              title={block.title}
              requiresAttention={!this.renderable}
              size={"large"}
              entity={this.entity}
            />
            <div className={`${baseClass}__button-list`}>
              <Authorize entity={this.entity} ability="delete">
                <Delete
                  baseClass={baseClass}
                  clickHandler={this.props.entityCallbacks.deleteBlock}
                  blockTitle={block.title}
                />
              </Authorize>
              <Authorize entity={this.entity} ability="update">
                <VisibilityToggle
                  visible={this.hideable}
                  entity={this.entity}
                  entityCallbacks={this.props.entityCallbacks}
                  blockTitle={block.title}
                />
                <Edit
                  visible={this.configurable}
                  baseClass={baseClass}
                  clickHandler={this.props.entityCallbacks.editBlock}
                  blockTitle={block.title}
                />
                <Drag
                  visible={this.orderable}
                  baseClass={baseClass}
                  dragHandleProps={this.props.dragHandleProps}
                  blockTitle={block.title}
                />
              </Authorize>
            </div>
          </div>
        )}
      </TypeComponent>
    );
  }
}
