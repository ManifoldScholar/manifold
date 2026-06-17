import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function FormColumnMapAttribute({
  name,
  instanceId,
  mapping,
  unLink,
  inWell,
  t
}) {
  const [element, setElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!element) return undefined;

    return draggable({
      element,
      getInitialData: () => ({ instanceId, column: name }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false)
    });
  }, [element, instanceId, name]);

  const handleCancel = event => {
    event.preventDefault();
    unLink(mapping, name);
  };

  return (
    <Styled.ColumnListing style={isDragging ? { opacity: 0.5 } : undefined}>
      <Styled.ColumnAvailable ref={setElement}>
        <Styled.ColumnName>{name}</Styled.ColumnName>
      </Styled.ColumnAvailable>
      {mapping && (
        <Styled.Cancel onClick={handleCancel} $well={inWell}>
          <span className="screen-reader-text">
            {t("forms.attribute_map.cancel", { name, mapping })}
          </span>
          <IconComposer icon="close16" size="default" />
        </Styled.Cancel>
      )}
    </Styled.ColumnListing>
  );
}

FormColumnMapAttribute.displayName = "Form.ColumnMap.Attribute";

FormColumnMapAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  mapping: PropTypes.string,
  unLink: PropTypes.func,
  inWell: PropTypes.bool,
  t: PropTypes.func
};

export default withTranslation()(FormColumnMapAttribute);
