import React from "react";
import Utility from "global/components/utility";
import IssueGridItem from "../../project-list/IssueGridItem";
import PropTypes from "prop-types";

const Volume = ({ volume }) => {
  return (
    <div className="volume">
      <div className="volume__title-bar">
        <div className="volume__title-bar-title">{volume.title}</div>
        <div className="volume__title-bar-icon">
          <Utility.IconComposer icon="arrowRight16" size={24} />
        </div>
      </div>
      <div className="volume__issuesBar">
        {volume.issues.map(issue => {
          return (
            <div className="volume__issuesBar-issue">
              <IssueGridItem
                key={issue.id}
                issue={issue}
                hideDesc
                hideCollectingToggle={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

Volume.displayName = "Journal.Detail.Volume";

Volume.propTypes = {
  volume: PropTypes.object.isRequired
};

export default Volume;
