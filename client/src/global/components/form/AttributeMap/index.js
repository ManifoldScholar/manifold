import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Mapping from "./Mapping";
import Instructions from "../Instructions";
import Attribute from "./Attribute";
import setter from "../setter";
import omitBy from "lodash/omitBy";
import difference from "lodash/difference";
import FieldWrapper from "../FieldWrapper";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

const sortAttributes = props => {
  const attributes = Object.values(props.getModelValue(props.attributes));
  const unavailableAttributes = Object.values(props.value);
  return attributes.filter(c => !unavailableAttributes.includes(c)).sort();
};

const sortHeaders = props => {
  const headers = props.getModelValue(props.headers);
  return Object.values(headers).map((header, index) => {
    if (header) return header;
    return props.t("col_header_placeholder", { num: index + 1 });
  });
};

class FormColumnMap extends PureComponent {
  static displayName = "Form.ColumnMap";

  static propTypes = {
    set: PropTypes.func.isRequired,
    instructions: PropTypes.string.isRequired,
    getModelValue: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedHeaders: sortHeaders(props),
      sortedAttributes: sortAttributes(props)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState) return null;
    const nextAttributes = sortAttributes(nextProps);
    if (difference(prevState.sortedAttributes, nextAttributes)) {
      return {
        sortedAttributes: nextAttributes
      };
    }

    return null;
  }

  onDragEnd = result => {
    if (!result.destination) return;
    const currentMap = this.props.value;
    const headerPosition = result.destination.droppableId;
    const column = result.draggableId;
    const updated = omitBy(currentMap, value => value === column);
    updated[headerPosition] = column;
    this.props.set(updated);
  };

  getHeaderPosition(header, props) {
    const headers = props.getModelValue(props.headers);
    return Object.keys(headers).find(key => headers[key] === header);
  }

  getCurrentMapping = position => {
    return this.props.value[position] || null;
  };

  autoMap = event => {
    event.preventDefault();
    this.props.set(this.props.getModelValue("attributes[columnAutomap]"));
  };

  unLinkMatch = (mapping, column) => {
    const currentMap = this.props.value;
    const updated = omitBy(currentMap, value => value === column);
    this.props.set(updated);
  };

  /* eslint-disable react/no-array-index-key */
  render() {
    const { sortedAttributes, sortedHeaders } = this.state;
    const t = this.props.t;

    return (
      <>
        <div>
          <Instructions instructions={this.props.instructions} />
        </div>
        <div>
          <button
            onClick={this.autoMap}
            className="button-secondary button-secondary--outlined"
          >
            {t("forms.attribute_map.auto_map")}
          </button>
        </div>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <FieldWrapper>
            <Styled.ColumnMap>
              <Styled.ColumnMappable>
                <Styled.ColumnHeading>
                  {t("forms.attribute_map.spreadsheet_cols")}
                </Styled.ColumnHeading>
                <Styled.MappableList>
                  {sortedHeaders.map((header, index) => {
                    const position = this.getHeaderPosition(header, this.props);
                    const id = position || (index + 1).toString();
                    return (
                      <li key={index}>
                        <Mapping
                          index={index}
                          name={header}
                          id={id}
                          match={this.getCurrentMapping(id)}
                          unLink={this.unLinkMatch}
                        />
                      </li>
                    );
                  })}
                </Styled.MappableList>
              </Styled.ColumnMappable>
              <Styled.Column>
                <Styled.ColumnHeading>
                  {t("forms.attribute_map.available")}
                </Styled.ColumnHeading>
                <Droppable droppableId="attributesAvailable" isDropDisabled>
                  {(provided, snapshotIgnored) => (
                    <Styled.Available ref={provided.innerRef}>
                      {sortedAttributes.map((attribute, index) => {
                        return (
                          <Attribute
                            key={attribute}
                            name={attribute}
                            index={index}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </Styled.Available>
                  )}
                </Droppable>
              </Styled.Column>
            </Styled.ColumnMap>
          </FieldWrapper>
        </DragDropContext>
      </>
    );
  }
  /* eslint-enable react/no-array-index-key */
}

export default withTranslation()(setter(FormColumnMap));
