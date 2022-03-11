import React from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import { useUIDSeed } from "react-uid";
import SearchDialog from "global/components/search/dialog";

function CollectingSearchDialog({ heading, onClose }) {
  const uidSeed = useUIDSeed();

  return (
    <SearchDialog
      onClose={onClose}
      labelledBy={uidSeed("label")}
      describedBy={uidSeed("description")}
      header={
        <div className="search-dialog__header">
          <Trans
            i18nKey="modals.collecting_search"
            components={[
              <h2 id={uidSeed("label")} className="search-dialog__heading" />,
              <p className="search-dialog__subheading" />,
              <p
                id={uidSeed("description")}
                className="search-dialog__instructions"
              />
            ]}
            values={{ heading }}
          />
        </div>
      }
    />
  );
}

CollectingSearchDialog.displayName = "Collecting.Search";

CollectingSearchDialog.propTypes = {
  heading: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CollectingSearchDialog;
