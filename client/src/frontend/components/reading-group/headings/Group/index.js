import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { Collapse } from "react-collapse";
import classNames from "classnames";
import { Title } from "../parts";
import DetailsToggle from "./DetailsToggle";
import ChildNav from "./ChildNav";
import ManageGroup from "./ManageGroup";
import GroupSummaryBox from "./GroupSummaryBox";

function GroupHeading({ readingGroup, history, location }) {
  const uid = useUID();
  const summaryRef = useRef();

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [showDetails]);

  const groupName = readingGroup.attributes.name;
  const canUpdateGroup = readingGroup.attributes.abilities.update;

  return (
    <header
      className={classNames({
        "group-page-heading": true,
        "group-page-heading--can-update": canUpdateGroup
      })}
    >
      <div className="group-page-heading__container">
        <div className="group-page-heading__flex-container">
          <Title title={groupName} />
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
  location: PropTypes.object.isRequired
};

export default GroupHeading;
