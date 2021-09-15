import * as React from "react";
import PropTypes from "prop-types";
import Collapse from "global/components/Collapse";
import classNames from "classnames";
import { Title } from "../parts";
import ChildNav from "./ChildNav";
import ManageGroup from "./ManageGroup";
import GroupSummaryBox from "./GroupSummaryBox";

function GroupHeading({ readingGroup, history, location }) {
  const groupName = readingGroup.attributes.name;
  const canUpdateGroup = readingGroup.attributes.abilities.update;

  return (
    <header
      className={classNames({
        "group-page-heading": true,
        "group-page-heading--can-update": canUpdateGroup
      })}
    >
      <Collapse>
        <div className="group-page-heading__container">
          <div className="group-page-heading__flex-container">
            <Title title={groupName} />
            <div className="group-page-heading__button-container">
              <Collapse.Toggle
                className={classNames({
                  "group-page-heading__nav-button": true,
                  "button-tertiary": true
                })}
                activeClassName="button-tertiary--active"
              >
                Details
              </Collapse.Toggle>
            </div>
          </div>
        </div>
        <div className="group-page-heading__container group-page-heading__nav-container">
          <ChildNav readingGroup={readingGroup} />
        </div>
        <Collapse.Content focusOnVisible>
          <div
            aria-label="Group details"
            className="group-page-heading__container group-page-heading__summary-container"
          >
            <GroupSummaryBox readingGroup={readingGroup} />
          </div>
        </Collapse.Content>
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
