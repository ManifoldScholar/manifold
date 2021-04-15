import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { number } from "@storybook/addon-knobs";
import ProjectGrid from "../Grid";

const projects = fixtures.collectionFactory("issue", 12);
const pagination = fixtures.pagination();

function Context(props) {
  return <div className="browse">{props.children}</div>;
}

storiesOf("Frontend/Projects", module).add("Grid", () => {
  const limit = number("Project limit", 12);

  return (
    <Context>
      <ProjectGrid
        projects={projects}
        pagination={pagination}
        paginationClickHandler={() => null}
        limit={limit}
      />
    </Context>
  );
});
