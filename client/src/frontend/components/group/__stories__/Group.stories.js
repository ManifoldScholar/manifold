import { build, storiesOf } from "helpers/storybook/exports";
import React from "react";
import GroupsTable from "../Table/Groups";
import MembersTable from "../Table/Members";
import JoinBox from "../JoinBox";
import Heading from "../Heading";
import GroupSummaryBox from "../GroupSummaryBox";
import NoteFilter from "../NoteFilter";

const groups = build.arrayOf.groups(8);
const members = build.arrayOf.members(8);
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
const groupName = group.attributes.name;

storiesOf("Frontend/Group", module)
  .add("Groups Table", () => {
    return (
      <GroupsTable
        groups={groups}
        pagination={pagination}
        onPageClick={() => console.log("Pagination clicked")}
      />
    );
  })
  .add("Members Table", () => {
    return (
      <MembersTable
        members={members}
        pagination={pagination}
        onPageClick={() => console.log("Pagination clicked")}
      />
    );
  })
  .add("Join Box", () => {
    return <JoinBox />;
  })
  .add("Group List Heading", () => {
    return <Heading pageType={"groupList"} />;
  })
  .add("Members List Heading", () => {
    return <Heading pageType={"memberList"} groupName={groupName} />;
  })
  .add("Group Detail Heading", () => {
    return (
      <Heading
        pageType={"groupDetail"}
        groupName={groupName}
        openEditDrawer={() => console.log("Drawer opened")}
        memberListLink={"/"}
      />
    );
  })
  .add("Group Summary Box", () => {
    return <GroupSummaryBox group={group} />;
  })
  .add("Note Filter", () => {
    return (
      <NoteFilter projects={projects} makers={makers} pagination={pagination} />
    );
  });
