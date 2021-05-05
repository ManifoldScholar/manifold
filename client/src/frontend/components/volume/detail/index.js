import React from "react";
import Card from "../../atomic/card";
import Utility from "global/components/utility";
import IssueGridItem from "../../project-list/IssueGridItem";

const VolumeDetail = ({ volume, blockClass = "volume-detail" }) => {
  return (
    <div className={blockClass}>
      <Card header title={`${volume.relationships.parent.name}: Volume${1}`}>
        {volume.relationships.issues.map(issue => {
          return (
            <>
              <div>
                <IssueGridItem
                  key={issue.id}
                  issue={issue}
                  hideDesc
                  hideCollectingToggle={false}
                />
              </div>
              <div>
                <div className="main">
                  <Utility.IconComposer size={56} icon="Projects64" />
                  <div className="body">
                    <h2 className="title">Table of Contents</h2>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </Card>
    </div>
  );
};

export default VolumeDetail;
