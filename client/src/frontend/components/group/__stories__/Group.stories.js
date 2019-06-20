import { build, storiesOf } from "helpers/storybook/exports";
import React from "react";
import Table from "../Table/index";
import JoinBox from "../JoinBox/index";

const groups = build.arrayOf.groups(8);

storiesOf("Frontend/Group", module)
  .add("Table", () => {
    return (
      <Table groups={groups} />
    );
  })
  .add("Join Box", () => {
    return (
      <JoinBox />
    );
  })
