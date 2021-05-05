import React from "react";
import IssueGridItem from "../../project-list/IssueGridItem";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import Card from "../../atomic/card";

const VolumeList = ({ volume, title, authorized }) => {
  return (
    <div className="volume">
      <Card
        header
        title={title || volume.title}
        icon="arrowRight16"
        iconSize={24}
        link={["frontendVolumeDetail", volume.id, volume.attributes.number]}
      >
        <ProjectList.Grid authenticated={authorized} limit={100}>
          {volume.issues.map(issue => {
            return (
              <li className="project-list__item--pos-rel">
                <IssueGridItem
                  key={issue.id}
                  issue={issue}
                  hideDesc
                  hideCollectingToggle={false}
                />
              </li>
            );
          })}
        </ProjectList.Grid>
      </Card>
    </div>
  );
};

VolumeList.displayName = "Journal.Detail.Volume";

VolumeList.propTypes = {
  volume: PropTypes.object.isRequired
};

export default VolumeList;
