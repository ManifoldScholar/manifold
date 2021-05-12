import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { number } from "@storybook/addon-knobs";
import GridList from "../../atomic/grid-list";
import { CSSTransition } from "react-transition-group";
import ProjectGridItem from "../ProjectGridItem";

const journals = fixtures.collectionFactory("issue", 12);
const pagination = fixtures.pagination();

function Context(props) {
  return <div className="browse">{props.children}</div>;
}

storiesOf("Frontend/Journals", module).add("Grid", () => {
  const limit = number("Project limit", 12);

  return (
    <Context>
      <GridList
        authenticated
        pagination={pagination}
        paginationClickHandler={() => null}
        limit={limit}
      >
        {journals.map(issue => {
          return (
            <CSSTransition enter exit timeout={{ enter: 250, exit: 250 }}>
              <li key={issue.id} className="grid-list__item--pos-rel">
                <ProjectGridItem
                  project={issue}
                  hideDesc
                  hideCollectingToggle={false}
                />
              </li>
            </CSSTransition>
          );
        })}
      </GridList>
    </Context>
  );
});
