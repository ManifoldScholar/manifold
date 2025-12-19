import { useId } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import SearchDialog from "global/components/search/dialog";

function CollectingSearchDialog({ heading, onClose }) {
  const baseId = useId();

  return (
    <SearchDialog
      onClose={onClose}
      labelledBy={`${baseId}-label`}
      describedBy={`${baseId}-description`}
      header={
        <div className="search-dialog__header">
          <Trans
            i18nKey="modals.collecting_search"
            components={[
              <h2 id={`${baseId}-label`} className="search-dialog__heading" />,
              <p className="search-dialog__subheading" />,
              <p
                id={`${baseId}-description`}
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
