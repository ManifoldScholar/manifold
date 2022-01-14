import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ContentBlockList from "frontend/components/content-block-list/List";
import { fixtures } from "helpers/storybook/exports";
import * as Styled from "./styles";

// TODO: update once API is in place
// Current component expects that contentBlock data matches that on projects
function getIssues(journal) {
  const sampleTexts = fixtures
    .collectionFactory("text", 4)
    .map((text, index) => {
      return {
        ...text.data,
        attributes: {
          ...text.attributes,
          position: index + 1
        }
      };
    });
  return fixtures.collectionFactory("issue", 2).map(issue => {
    return {
      ...issue.data,
      relationships: {
        texts: sampleTexts,
        textCategories: [],
        contentBlocks: [
          {
            id: "cf56452c-973f-4244-8b5d-d11dc8c24bfc",
            type: "textsBlocks",
            attributes: {
              type: "Content::TextsBlock",
              position: 1,
              visible: true,
              access: "always",
              renderable: true,
              showAuthors: true,
              showDescriptions: false,
              showSubtitles: true,
              showCovers: true,
              showDates: true,
              showCategoryLabels: true,
              title: null,
              showUncategorized: true
            },
            relationships: {
              project: {
                data: {
                  id: "738b2a20-8fd9-4111-93af-f20a8e7fd9cc",
                  type: "projects"
                }
              },
              includedCategories: []
            }
          }
        ]
      }
    };
  });
}

function VolumeDetail({ journal, volume }) {
  const journalTitle = journal.attributes.title;
  const volumeTitle = volume.attributes.title;
  const issues = getIssues(journal) || [];

  return (
    <Styled.Wrapper>
      <EntityGroup title={`${journalTitle}: ${volumeTitle}`}>
        {issues.map(issue => (
          <Styled.IssueWrapper>
            <ThumbnailGrid key={issue.id} minColumns={4} minItemWidth="210px">
              {({ stack }) => (
                <EntityThumbnail entity={issue} stack={stack} key={issue.id} />
              )}
            </ThumbnailGrid>
            <ContentBlockList entity={issue} nested hideHeader />
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
