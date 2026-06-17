import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Attribute from "../Attribute";
import isNil from "lodash/isNil";
import * as Styled from "./styles";

function FormColumnMapMapping({ name, id, instanceId, match, unLink, t }) {
  const [element, setElement] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    if (!element) return undefined;

    return dropTargetForElements({
      element,
      // A well holds a single attribute, so it only accepts a drop while empty.
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId && isNil(match),
      getData: () => ({ position: id }),
      onDragEnter: () => setIsDraggingOver(true),
      onDragLeave: () => setIsDraggingOver(false),
      onDrop: () => setIsDraggingOver(false)
    });
  }, [element, instanceId, id, match]);

  return (
    <Styled.Mapping>
      <Styled.ColumnLabel>
        <Styled.LabelTruncated>{name}</Styled.LabelTruncated>
      </Styled.ColumnLabel>
      <Styled.Well ref={setElement} $dragOver={isDraggingOver}>
        {match ? (
          <Attribute
            name={match}
            instanceId={instanceId}
            unLink={unLink}
            mapping={name}
            inWell
          />
        ) : null}
        <Styled.Placeholder $matched={match}>
          {t("forms.attribute_map.placeholder")}
        </Styled.Placeholder>
      </Styled.Well>
    </Styled.Mapping>
  );
}

FormColumnMapMapping.displayName = "Form.ColumnMap.Mapping";

FormColumnMapMapping.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  match: PropTypes.string,
  unLink: PropTypes.func,
  t: PropTypes.func
};

export default withTranslation()(FormColumnMapMapping);
