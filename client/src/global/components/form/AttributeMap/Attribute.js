import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";

class FormColumnMapAttribute extends PureComponent {
  static displayName = "Form.ColumnMap.Attribute";

  static propTypes = {
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    mapping: PropTypes.string,
    unLink: PropTypes.func,
    t: PropTypes.func
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.unLink(this.props.mapping, this.props.name);
  };

  render() {
    return (
      <Draggable draggableId={this.props.name} index={this.props.index}>
        {provided => {
          return (
            <div className="form-column-listing">
              <div
                ref={provided.innerRef}
                className="form-column-available"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <span className="text">{this.props.name}</span>
              </div>
              {this.props.mapping && (
                <button className="cancel" onClick={this.handleCancel}>
                  <span className="screen-reader-text">
                    {this.props.t("forms.attribute_map.cancel", {
                      name: this.props.name,
                      mapping: this.props.mapping
                    })}
                  </span>
                  <IconComposer
                    icon="close16"
                    size="default"
                    className="cancel__icon"
                  />
                </button>
              )}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

export default withTranslation()(FormColumnMapAttribute);
