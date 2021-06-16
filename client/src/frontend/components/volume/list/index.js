import React from "react";
import IssueGridItem from "../../grid-list-items/IssueGridItem";
import PropTypes from "prop-types";
import GridList from "../../atomic/grid-list";
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
        <GridList authenticated={authorized} limit={100}>
          {volume.issues.map(issue => {
            return (
              <li className="grid-list__item--pos-rel">
                <IssueGridItem
                  key={issue.id}
                  issue={issue}
                  hideDesc
                  hideCollectingToggle={false}
                />
              </li>
            );
          })}
        </GridList>
      </Card>
    </div>
  );
};

VolumeList.displayName = "Journal.Detail.Volume";

VolumeList.propTypes = {
  volume: PropTypes.object.isRequired
};

export default VolumeList;
