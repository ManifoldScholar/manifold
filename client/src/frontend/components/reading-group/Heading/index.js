import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { Collapse } from "react-collapse";
import Title from "./Title";
import DetailsToggle from "./DetailsToggle";
import ChildNav from "./ChildNav";
import ManageGroup from "./ManageGroup";
import GroupSummaryBox from "./GroupSummaryBox";

function Heading({ readingGroup, canUpdateGroup }) {
  const uid = useUID();
  const summaryRef = useRef();

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [showDetails]);

  const groupName = readingGroup.attributes.name;

  return (
    <header className="group-page-heading">
      <div className="group-page-heading__container">
        <div className="group-page-heading__flex-container">
          <Title groupName={groupName} />
          <div className="group-page-heading__button-container">
            <DetailsToggle
              onClick={() => setShowDetails(prevState => !prevState)}
              controls={uid}
              active={showDetails}
            />
          </div>
        </div>
      </div>
      <div className="group-page-heading__container group-page-heading__nav-container">
        <ChildNav readingGroup={readingGroup} />
      </div>
      <Collapse isOpened={showDetails}>
        <div
          ref={summaryRef}
          id={uid}
          tabIndex={-1}
          aria-label="Group details"
          className="group-page-heading__container group-page-heading__summary-container"
        >
          <GroupSummaryBox readingGroup={readingGroup} />
        </div>
      </Collapse>
      {canUpdateGroup && (
        <div className="group-page-heading__container">
          <ManageGroup readingGroup={readingGroup} />
        </div>
      )}
    </header>
  );
}

Heading.displayName = "ReadingGroup.Heading";

Heading.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  canUpdateGroup: PropTypes.bool
};

export default Heading;
