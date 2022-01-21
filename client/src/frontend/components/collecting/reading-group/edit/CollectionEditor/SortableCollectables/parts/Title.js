import React from "react";
import PropTypes from "prop-types";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import {
  getResponse,
  idInResponses
} from "frontend/components/collecting/helpers";
import * as Styled from "./styles";

function getCollectableTitle(response) {
  const { attributes, type } = response;
  if (type === "textSections")
    return `${attributes.name} <i>in ${attributes.textTitle}</i>`;
  return attributes.title;
}

function CollectableTitle({ id, responses, labelId }) {
  const isLoaded = idInResponses(id, responses);

  if (!isLoaded)
    return (
      <Skeleton
        style={{
          height: 14,
          maxWidth: "100%",
          width: 350,
          transform: "translateY(1px)"
        }}
        nested
      />
    );

  const response = getResponse(id, responses);

  return (
    <Styled.Title
      id={labelId}
      dangerouslySetInnerHTML={{ __html: getCollectableTitle(response) }}
    />
  );
}

CollectableTitle.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable.Title";

CollectableTitle.propTypes = {
  id: PropTypes.string.isRequired,
  responses: PropTypes.array.isRequired,
  labelId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CollectableTitle;
