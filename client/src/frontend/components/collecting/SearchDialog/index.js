import React from "react";
import PropTypes from "prop-types";
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
          <h2 id={uidSeed("label")} className="search-dialog__heading">
            Add content
          </h2>
          <p className="search-dialog__subheading">{heading}</p>
          <p
            id={uidSeed("description")}
            className="search-dialog__instructions"
          >
            To add content to your Reading Group, search for it by keyword and
            type, when you have found content you wish to add, select the star
            icon for that item to add it to your group.
          </p>
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
