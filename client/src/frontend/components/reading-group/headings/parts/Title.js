import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function HeadingTitle({ title, icon = "readingGroup24" }) {
  return (
    <div className="group-page-heading__text-container">
      <IconComposer
        icon={icon}
        size={32}
        iconClass={"group-page-heading__icon"}
      />
      <h1 className={"heading-primary group-page-heading__text"}>{title}</h1>
    </div>
  );
}

HeadingTitle.displayName = "ReadingGroup.Heading.Title";

HeadingTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default HeadingTitle;
