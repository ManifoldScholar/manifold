import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Droppable } from "react-beautiful-dnd";
import Attribute from "../Attribute";
import isNil from "lodash/isNil";
import * as Styled from "./styles";

class FormColumnMapMapping extends PureComponent {
  static displayName = "Form.ColumnMap.Mapping";

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    match: PropTypes.string,
    unLink: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const { match } = this.props;

    return (
      <Styled.Mapping>
        <Styled.ColumnLabel>
          <Styled.LabelTruncated>{this.props.name}</Styled.LabelTruncated>
        </Styled.ColumnLabel>
        <Droppable droppableId={this.props.id} isDropDisabled={!isNil(match)}>
          {(provided, snapshot) => {
            return (
              <Styled.Well
                ref={provided.innerRef}
                $dragOver={snapshot.isDraggingOver}
              >
                {this.props.match ? (
                  <Attribute
                    name={this.props.match}
                    index={this.props.index}
                    unLink={this.props.unLink}
                    mapping={this.props.name}
                    inWell
                  />
                ) : null}
                <Styled.Placeholder $matched={this.props.match}>
                  {this.props.t("forms.attribute_map.placeholder")}
                </Styled.Placeholder>
                {provided.placeholder}
              </Styled.Well>
            );
          }}
        </Droppable>
      </Styled.Mapping>
    );
  }
}

export default withTranslation()(FormColumnMapMapping);
