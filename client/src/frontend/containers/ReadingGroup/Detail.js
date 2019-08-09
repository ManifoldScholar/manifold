import React, { Component } from "react";
import GroupSummaryBox from "frontend/components/reading-group/GroupSummaryBox";
import Heading from "frontend/components/reading-group/Heading";
import lh from "helpers/linkHandler";
import BackLink from "frontend/components/back-link";

export default class ReadingGroupsDetailContainer extends Component {
  render() {
    const { readingGroup } = this.props;

    return (
      <React.Fragment>
        <BackLink.Register
          link={lh.link("readingGroups")}
          backText={"Manage Reading Groups"}
        />
        <Heading
          buttons={[
            {
              to: lh.link("readingGroupMembers", readingGroup.id),
              text: "See all Members"
            },
            {
              to: lh.link("readingGroupEdit", readingGroup.id),
              text: "Edit Group"
            }
          ]}
        >
          {readingGroup.attributes.name}
        </Heading>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <GroupSummaryBox readingGroup={readingGroup} />
        </div>
      </React.Fragment>
    );
  }
}
