import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

function EntityThumbnailJournalVolume({ width, height, className }) {
  return (
    <Utility.IconComposer
      className={className}
      svgProps={{ width, height }}
      icon="Journals64"
    />
  );
}

EntityThumbnailJournalVolume.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
};

export default EntityThumbnailJournalVolume;
