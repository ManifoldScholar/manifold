import { build, storiesOf } from "helpers/storybook/exports";
import React from "react";
import Table from "../index";

const groups = build.arrayOf.groups(8);

storiesOf("Frontend/Group", module)
  .add("Table", () => {
    return (
      <Table />
    );
  })
  .add("Join Box", () => {
    return (
      <div>This will be the join box.</div>
    );
  })

