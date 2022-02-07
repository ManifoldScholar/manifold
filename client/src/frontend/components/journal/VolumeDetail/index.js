import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ContentBlockList from "frontend/components/content-block-list/List";
import * as Styled from "./styles";

function VolumeDetail({ journal, volume }) {
  const journalTitle = journal.attributes.title;
  const volumeTitle = `Volume ${volume.attributes.number}`;
  const issues = volume.relationships.journalIssues;

  return (
    <Styled.Wrapper>
      <EntityGroup title={`${journalTitle}: ${volumeTitle}`}>
        {issues.map(issue => (
          <Styled.IssueWrapper key={issue.id}>
            <ThumbnailGrid minColumns={4} minItemWidth="210px">
              {({ stack }) => (
                <EntityThumbnail
                  entity={issue}
                  stack={stack}
                  key={issue.id}
                  parentView
                />
              )}
            </ThumbnailGrid>
            <ContentBlockList
              entity={issue.relationships.project}
              nested
              hideHeader
            />
          </Styled.IssueWrapper>
        ))}
      </EntityGroup>
    </Styled.Wrapper>
  );
}

VolumeDetail.displayName = "Journal.VolumeDetail";

VolumeDetail.propTypes = {
  journal: PropTypes.object.isRequired,
  volume: PropTypes.object.isRequired
};

export default VolumeDetail;
