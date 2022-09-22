import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

class FormColumnMapAttribute extends PureComponent {
  static displayName = "Form.ColumnMap.Attribute";

  static propTypes = {
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    mapping: PropTypes.string,
    unLink: PropTypes.func,
    t: PropTypes.func,
    inWell: PropTypes.bool
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
            <Styled.ColumnListing>
              <Styled.ColumnAvailable
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Styled.ColumnName $matched={this.props.matched}>
                  {this.props.name}
                </Styled.ColumnName>
              </Styled.ColumnAvailable>
              {this.props.mapping && (
                <Styled.Cancel
                  onClick={this.handleCancel}
                  $well={this.props.inWell}
                >
                  <span className="screen-reader-text">
                    {this.props.t("forms.attribute_map.cancel", {
                      name: this.props.name,
                      mapping: this.props.mapping
                    })}
                  </span>
                  <IconComposer icon="close16" size="default" />
                </Styled.Cancel>
              )}
            </Styled.ColumnListing>
          );
        }}
      </Draggable>
    );
  }
}

export default withTranslation()(FormColumnMapAttribute);
