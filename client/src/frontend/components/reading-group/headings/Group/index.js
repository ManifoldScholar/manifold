import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { Collapse } from "react-collapse";
import classNames from "classnames";
import Title from "./Title";
import DetailsToggle from "./DetailsToggle";
import ChildNav from "./ChildNav";
import ManageGroup from "./ManageGroup";
import GroupSummaryBox from "./GroupSummaryBox";

function GroupHeading({ readingGroup, canUpdateGroup, history, location }) {
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
    <header
      className={classNames({
        "group-page-heading": true,
        "group-page-heading--can-update": canUpdateGroup
      })}
    >
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
          <ManageGroup
            readingGroup={readingGroup}
            history={history}
            location={location}
          />
        </div>
      )}
    </header>
  );
}

GroupHeading.displayName = "ReadingGroup.GroupHeading";

GroupHeading.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  canUpdateGroup: PropTypes.bool
};

export default GroupHeading;
