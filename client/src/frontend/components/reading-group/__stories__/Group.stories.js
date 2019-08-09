import { build, storiesOf } from "helpers/storybook/exports";
import React from "react";
import GroupsTable from "../Table/Groups";
import MembersTable from "../Table/Members";
import JoinBox from "../JoinBox";
import Heading from "../Heading";
import GroupSummaryBox from "../GroupSummaryBox";
import NoteFilter from "../NoteFilter";

const groups = build.arrayOf.readingGroups(8);
const members = build.arrayOf.readingGroupMemberships(8);
const projects = build.arrayOf.projects(8);
const makers = build.arrayOf.makers(8);
const pagination = {
  perPage: 8,
  currentPage: 3,
  nextPage: 2,
  prevPage: 0,
  totalPages: 10,
  totalCount: 32
};
const group = groups[0];

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
    return (
      <Heading
        buttons={[
          {
            to: "/foo",
            text: "See all Members"
          },
          {
            to: "/bar",
            text: "Edit Group"
          }
        ]}
      >
        Heading text here
      </Heading>
    );
  })
  .add("Group Summary Box", () => {
    return <GroupSummaryBox readingGroup={group} />;
  })
  .add("Note Filter", () => {
    return (
      <NoteFilter projects={projects} makers={makers} pagination={pagination} />
    );
  });
