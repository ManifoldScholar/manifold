import * as React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import { Title } from "../parts";
import ChildNav from "./ChildNav";
import ManageGroup from "./ManageGroup";
import GroupSummaryBox from "./GroupSummaryBox";
import * as Styled from "./styles";

function GroupHeading({ readingGroup, history, location }) {
  const { t } = useTranslation();

  const {
    name: groupName,
    abilities,
    currentUserRole
  } = readingGroup.attributes;
  const canUpdateGroup = abilities.update;
  const isMember = currentUserRole !== "none";

  function getTag() {
    const membership =
      readingGroup.relationships.currentUserReadingGroupMembership;

    if (!membership || membership.attributes.state !== "archived") return null;
    return t("common.archived");
  }

  return (
    <Styled.GroupHeader $canUpdate={canUpdateGroup}>
      <Collapse>
        <Styled.Container>
          <Styled.Flex>
            <Title
              title={groupName}
              tag={getTag()}
              adminWarning={canUpdateGroup && !isMember}
            />
            <Collapse.Toggle
              className={`button-tertiary`}
              activeClassName="button-tertiary--active"
            >
              {t("navigation.reading_group.details")}
            </Collapse.Toggle>
          </Styled.Flex>
        </Styled.Container>
        <Styled.NavContainer>
          <ChildNav readingGroup={readingGroup} />
        </Styled.NavContainer>
        <Collapse.Content focusOnVisible>
          <Styled.Summary aria-label={t("pages.subheaders.group_details")}>
            <GroupSummaryBox readingGroup={readingGroup} />
          </Styled.Summary>
        </Collapse.Content>
      </Collapse>
      {canUpdateGroup && (
        <Styled.Container>
          <ManageGroup
            readingGroup={readingGroup}
            history={history}
            location={location}
          />
        </Styled.Container>
      )}
    </Styled.GroupHeader>
  );
}

GroupHeading.displayName = "ReadingGroup.GroupHeading";

GroupHeading.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default GroupHeading;
