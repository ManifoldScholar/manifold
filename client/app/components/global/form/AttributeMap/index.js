import {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useFormField } from "hooks";
import { FormContext } from "contexts";
import Mapping from "./Mapping";
import Instructions from "../Instructions";
import Attribute from "./Attribute";
import { difference, omitBy } from "lodash-es";
import FieldWrapper from "../FieldWrapper";
import ClientOnly from "components/global/utility/ClientOnly";
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

  const [instanceId] = useState(() => Symbol("attributeMap"));

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
    const headers = getModelValue(headersPath);
    return Object.keys(headers).find(key => headers[key] === header);
  };

  const getCurrentMapping = position => {
    return value?.[position] || null;
  };

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
                  <li key={id}>
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
