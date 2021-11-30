import React from "react";
import PropTypes from "prop-types";
import Template from "../../Template";
import Text from "frontend/components/text/Text";
import * as Styled from "frontend/components/text-list/List/styles";

function CollectedTexts({ onUncollect, ...props }) {
  return (
    <Template
      {...props}
      type="texts"
      ListComponent={({ children, ...restProps }) => (
        <Styled.List $noLabel>{children(restProps)}</Styled.List>
      )}
      ResponseComponent={({ response }) => (
        <Text
          text={response}
          showAuthors={false}
          showDates
          showDescriptions={false}
          showSubtitles
          onUncollect={onUncollect}
        />
      )}
    />
  );
}

CollectedTexts.displayName = "Collecting.CollectedTexts";

CollectedTexts.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func,
  nested: PropTypes.bool
};

export default CollectedTexts;
