import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Mapping from "./Mapping";
import Instructions from "../Instructions";
import Attribute from "./Attribute";
import setter from "../setter";
import omitBy from "lodash/omitBy";
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

function FormColumnMap(props) {
  const { set, instructions, value, t } = props;

  const [instanceId] = useState(() => Symbol("attributeMap"));
  // Headers are fixed at mount (mirrors the old constructor-only state);
  // available attributes are recomputed each render from the current value.
  const [sortedHeaders] = useState(() => sortHeaders(props));
  const sortedAttributes = sortAttributes(props);

  // The window-level monitor is registered once but needs the current mapping
  // and setter on drop, so read them through refs.
  const valueRef = useRef(value);
  valueRef.current = value;
  const setRef = useRef(set);
  setRef.current = set;

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.instanceId === instanceId,
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const position = target.data.position;
        const column = source.data.column;
        const updated = omitBy(valueRef.current, mapped => mapped === column);
        updated[position] = column;
        setRef.current(updated);
      }
    });
  }, [instanceId]);

  const getHeaderPosition = header => {
    const headers = props.getModelValue(props.headers);
    return Object.keys(headers).find(key => headers[key] === header);
  };

  const getCurrentMapping = position => value[position] || null;

  const autoMap = event => {
    event.preventDefault();
    set(props.getModelValue("attributes[columnAutomap]"));
  };

  const unLinkMatch = (mapping, column) => {
    const updated = omitBy(value, mapped => mapped === column);
    set(updated);
  };

  /* eslint-disable react/no-array-index-key */
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
      <FieldWrapper>
        <Styled.ColumnMap>
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
                      name={header}
                      id={id}
                      instanceId={instanceId}
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
            <Styled.Available>
              {sortedAttributes.map(attribute => (
                <Attribute
                  key={attribute}
                  name={attribute}
                  instanceId={instanceId}
                />
              ))}
            </Styled.Available>
          </Styled.Column>
        </Styled.ColumnMap>
      </FieldWrapper>
    </>
  );
  /* eslint-enable react/no-array-index-key */
}

FormColumnMap.displayName = "Form.ColumnMap";

FormColumnMap.propTypes = {
  set: PropTypes.func.isRequired,
  instructions: PropTypes.string.isRequired,
  getModelValue: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  attributes: PropTypes.string,
  headers: PropTypes.string,
  t: PropTypes.func
};

export default withTranslation()(setter(FormColumnMap));
