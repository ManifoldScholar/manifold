import React from "react";
import PropTypes from "prop-types";
import Template from "../../Template";
import TOC from "frontend/components/toc";
import * as Styled from "frontend/components/toc/List/styles";

function CollectedTextSections(props) {
  return (
    <Template
      {...props}
      type="textSections"
      ListComponent={({ children, ...restProps }) => (
        <Styled.Block>
          <Styled.List $depth={1} $large>
            {children(restProps)}
          </Styled.List>
        </Styled.Block>
      )}
      ResponseComponent={({ response }) => {
        const {
          id: nodeId,
          attributes: { name, textSlug, textTitle }
        } = response;
        return (
          <TOC.Node
            id={nodeId}
            title={name}
            textSlug={textSlug}
            textTitle={textTitle}
          />
        );
      }}
    />
  );
}

CollectedTextSections.displayName = "Collecting.CollectedTextSections";

CollectedTextSections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedTextSections;
