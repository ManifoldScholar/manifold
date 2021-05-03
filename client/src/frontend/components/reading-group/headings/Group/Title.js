import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function HeadingTitle({ groupName }) {
  return (
    <div className="group-page-heading__text-container">
      <IconComposer
        icon="readingGroup24"
        size={32}
        iconClass={"group-page-heading__icon"}
      />
      <h1 className={"heading-primary group-page-heading__text"}>
        {groupName}
      </h1>
    </div>
  );
}

HeadingTitle.displayName = "ReadingGroup.Heading.Title";

HeadingTitle.propTypes = {
  groupName: PropTypes.string.isRequired
};

export default HeadingTitle;
