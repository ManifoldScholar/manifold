import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { collectedIdsForCollection } from "frontend/components/collecting/helpers";

function CollectedCount({ collection }) {
  const { t } = useTranslation(["frontend"]);

  const collectedIds = collectedIdsForCollection(collection);
  const totalCount = collectedIds.length;
  const label = totalCount === 1 ? "item" : "items";

  if (!collection?.length < 1) return null;

  return (
    <p className="list-total">
      <Trans t={t} key="messages.starred_count">
        You have starred{" "}
        <span className="list-total__highlighted">{totalCount}</span> {label}
        {":"}
      </Trans>
    </p>
  );
}

CollectedCount.displayName = "Collecting.CollectedCount";

CollectedCount.propTypes = {
  collection: PropTypes.object
};

export default CollectedCount;
