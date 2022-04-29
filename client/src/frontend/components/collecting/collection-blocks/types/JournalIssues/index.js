import React from "react";
import PropTypes from "prop-types";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import Template from "../../Template";

function CollectedJournalIssues({ onUncollect, ...props }) {
  return (
    <Template
      {...props}
      type="journalIssues"
      ListComponent={ThumbnailGrid}
      ResponseComponent={({ response, ...restProps }) => (
        <EntityThumbnail
          entity={response}
          onUncollect={onUncollect}
          {...restProps}
        />
      )}
    />
  );
}

CollectedJournalIssues.displayName = "Collecting.CollectedJournalIssues";

CollectedJournalIssues.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func,
  nested: PropTypes.bool
};

export default CollectedJournalIssues;
