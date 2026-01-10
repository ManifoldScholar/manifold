import { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  DragDropContext,
  Droppable
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { useFormField } from "hooks";
import { FormContext } from "helpers/contexts";
import Mapping from "./Mapping";
import Instructions from "../Instructions";
import Attribute from "./Attribute";
import omitBy from "lodash/omitBy";
import difference from "lodash/difference";
import FieldWrapper from "../FieldWrapper";
import * as Styled from "./styles";

const sortAttributes = (getModelValue, attributesPath, currentValue) => {
  const attributes = Object.values(getModelValue(attributesPath));
  const unavailableAttributes = Object.values(currentValue || {});
  return attributes.filter(c => !unavailableAttributes.includes(c)).sort();
};

const sortHeaders = (getModelValue, headersPath, t) => {
  const headers = getModelValue(headersPath);
  return Object.values(headers).map((header, index) => {
    if (header) return header;
    return t("col_header_placeholder", { num: index + 1 });
  });
};

export default function FormColumnMap({
  name,
  instructions,
  attributes: attributesPath,
  headers: headersPath
}) {
  const { t } = useTranslation();
  const { value, set } = useFormField(name);
  const context = useContext(FormContext);
  const { getModelValue } = context || {};

  const [sortedHeaders] = useState(() =>
    getModelValue ? sortHeaders(getModelValue, headersPath, t) : []
  );

  const [sortedAttributes, setSortedAttributes] = useState(() =>
    getModelValue ? sortAttributes(getModelValue, attributesPath, value) : []
  );

  // Update sorted attributes when value changes
  const updateSortedAttributes = useCallback(() => {
    if (!getModelValue) return;
    const nextAttributes = sortAttributes(getModelValue, attributesPath, value);
    if (difference(sortedAttributes, nextAttributes).length > 0) {
      setSortedAttributes(nextAttributes);
    }
  }, [getModelValue, attributesPath, value, sortedAttributes]);

  // Call update on render
  updateSortedAttributes();

  const getHeaderPosition = useCallback(
    header => {
      if (!getModelValue) return null;
      const headers = getModelValue(headersPath);
      return Object.keys(headers).find(key => headers[key] === header);
    },
    [getModelValue, headersPath]
  );

  const getCurrentMapping = useCallback(
    position => {
      return value?.[position] || null;
    },
    [value]
  );

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) return;
      const headerPosition = result.destination.droppableId;
      const column = result.draggableId;
      const updated = omitBy(value, v => v === column);
      updated[headerPosition] = column;
      set(updated);
    },
    [value, set]
  );

  const autoMap = useCallback(
    event => {
      event.preventDefault();
      if (getModelValue) {
        set(getModelValue("attributes[columnAutomap]"));
      }
    },
    [getModelValue, set]
  );

  const unLinkMatch = useCallback(
    (mapping, column) => {
      const updated = omitBy(value, v => v === column);
      set(updated);
    },
    [value, set]
  );

  return (
    <>
      <div>
        <Instructions instructions={instructions} />
      </div>
      <div>
        <button
          onClick={autoMap}
          className="button-secondary button-secondary--outlined"
        >
          {t("forms.attribute_map.auto_map")}
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <FieldWrapper>
          <Styled.ColumnMap className="rbd-migration-resets">
            <Styled.ColumnMappable>
              <Styled.ColumnHeading>
                {t("forms.attribute_map.spreadsheet_cols")}
              </Styled.ColumnHeading>
              <Styled.MappableList>
                {sortedHeaders.map((header, index) => {
                  const position = getHeaderPosition(header);
                  const id = position || (index + 1).toString();
                  return (
                    <li key={index}>
                      <Mapping
                        index={index}
                        name={header}
                        id={id}
                        match={getCurrentMapping(id)}
                        unLink={unLinkMatch}
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
                {(provided, snapshot) => (
                  <Styled.Available ref={provided.innerRef}>
                    {sortedAttributes.map((attribute, index) => {
                      return (
                        <Attribute
                          key={attribute}
                          name={attribute}
                          index={index}
                          isDragging={
                            snapshot.draggingFromThisWith === attribute
                          }
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

FormColumnMap.displayName = "Form.ColumnMap";

FormColumnMap.propTypes = {
  name: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  attributes: PropTypes.string.isRequired,
  headers: PropTypes.string.isRequired
};
