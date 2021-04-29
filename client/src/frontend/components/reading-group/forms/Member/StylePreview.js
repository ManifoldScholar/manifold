import React from "react";
import PropTypes from "prop-types";

function StylePreview({ style }) {
  return (
    <div className="member-settings-form__style-preview">
      <p>
        <span className={`underline-${style}`}>
          This is what your selected annotation style will look like when viewed
          in the reader. Font styling and sizing may be different depending on
          the settings in your visibility control panel.
        </span>
      </p>
    </div>
  );
}

StylePreview.displayName = "ReadingGroup.Forms.MemberSettings.StylePreview";

StylePreview.propTypes = {
  style: PropTypes.string
};

export default StylePreview;
