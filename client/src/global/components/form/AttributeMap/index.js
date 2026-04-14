import { useState, useCallback, useContext, useEffect, useMemo } from "react";
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
import ClientOnly from "global/components/utility/ClientOnly";
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
  const { getModelValue } = useContext(FormContext);

  const sortedHeaders = useMemo(
    () => sortHeaders(getModelValue, headersPath, t),
    [getModelValue, headersPath, t]
  );

  const [sortedAttributes, setSortedAttributes] = useState(() =>
    sortAttributes(getModelValue, attributesPath, value)
  );

  useEffect(() => {
    const nextAttributes = sortAttributes(getModelValue, attributesPath, value);
    setSortedAttributes(prev =>
      difference(prev, nextAttributes).length > 0 ? nextAttributes : prev
    );
  }, [getModelValue, attributesPath, value]);

  const getHeaderPosition = header => {
    const headers = getModelValue(headersPath);
    return Object.keys(headers).find(key => headers[key] === header);
  };

  const getCurrentMapping = position => {
    return value?.[position] || null;
  };

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
      set(getModelValue("attributes[columnAutomap]"));
    },
    [getModelValue, set]
  );

  const unLinkMatch = useCallback(
    (_mapping, column) => {
      const updated = omitBy(value, v => v === column);
      set(updated);
    },
    [value, set]
  );

  return (
    <ClientOnly>
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
                    <li key={id}>
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
    </ClientOnly>
  );
}

FormColumnMap.displayName = "Form.ColumnMap";

FormColumnMap.propTypes = {
  name: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  attributes: PropTypes.string.isRequired,
  headers: PropTypes.string.isRequired
};
