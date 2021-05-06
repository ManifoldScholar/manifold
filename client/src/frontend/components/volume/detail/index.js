import React from "react";
import Card from "../../atomic/card";
import Utility from "global/components/utility";
import IssueGridItem from "../../grid-list-items/IssueGridItem";
import classNames from "classnames";

const VolumeDetail = ({ volume, blockClass = "volume-detail" }) => {
  return (
    <div className={blockClass}>
      <Card header title={`${volume.relationships.parent.name}: Volume ${1}`}>
        {volume.relationships.issues.map(issue => {
          return (
            <>
              <div className="grid-list grid entity-section-wrapper__body">
                <div className="grid-list__item--pos-rel issue-grid-item">
                  <IssueGridItem
                    key={issue.id}
                    issue={issue}
                    hideDesc
                    hideCollectingToggle={false}
                  />
                </div>
              </div>
              {issue.attributes.toc && (
                <div className="issue-toc">
                  <div
                    className={classNames([
                      "entity-section-wrapper__heading",
                      "section-heading"
                    ])}
                  >
                    <div className="main">
                      <Utility.IconComposer size={56} icon="Toc64" />
                      <div className="body">
                        <h2 className="title">Table of Contents</h2>
                      </div>
                    </div>
                  </div>

                  <div className="toc">
                    <ul>
                      {issue.attributes.toc.map(article => {
                        return <li>{article}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </>
          );
        })}
      </Card>
    </div>
  );
};

export default VolumeDetail;
