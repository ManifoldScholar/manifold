import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import GroupsTable from "../Table/Groups";
import MembersTable from "../Table/Members";
import JoinBox from "../JoinBox";
import Heading from "../Heading";
import GroupSummaryBox from "../Heading/GroupSummaryBox";

const groups = fixtures.collectionFactory("readingGroup", 8);
const user = fixtures.factory("user");
const members = fixtures.collectionFactory(
  "readingGroupMembership",
  8,
  (type, index) => ({
    id: `${type}-${index}`,
    relationships: { readingGroup: groups[0], user }
  })
);

const group = fixtures.factory("readingGroup", {
  relationships: {
    texts: fixtures.collectionFactory("text"),
    readingGroupMemberships: members
  }
});

const pagination = fixtures.pagination();

storiesOf("Frontend/ReadingGroup", module)
  .add("Tables/Group", () => {
    return (
      <GroupsTable
        groups={groups}
        pagination={pagination}
        onPageClick={() => console.log("Pagination clicked")}
      />
    );
  })
  .add("Table/Members", () => {
    return (
      <MembersTable
        readingGroup={members[0].relationships.readingGroup}
        members={members}
        pagination={pagination}
        onPageClick={() => console.log("Pagination clicked")}
      />
    );
  })
  .add("Join Box", () => {
    return <JoinBox />;
  })
  .add("Heading", () => {
    return <Heading readingGroup={group} />;
  })
  .add("Group Summary Box", () => {
    return <GroupSummaryBox readingGroup={group} />;
  });
