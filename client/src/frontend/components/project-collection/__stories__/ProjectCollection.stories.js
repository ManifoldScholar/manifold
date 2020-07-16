import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { boolean, number, select } from "@storybook/addon-knobs";
import ProjectCollection from "../index";

import icon from "test/assets/icon.png";
import heroBackground from "test/assets/hero-bg.jpg";
import squareHero from "test/assets/hero-square.jpg";

const { Summary, Detail } = ProjectCollection;

const projects = fixtures.collectionFactory("project");
const collectionProjects = fixtures.collectionFactory("collectionProject");
const projectCollection = fixtures.factory("projectCollection", {
  relationships: { collectionProjects, subjects: [], projects }
});
const pagination = fixtures.pagination();

function createProjectCollectionWithImages(detailType) {
  const mergedAttributes = {
    iconStyles: null,
    heroStyles: null,
    heroLayout: null
  };

  if (detailType === "customIcon") {
    mergedAttributes.iconStyles = { square: icon };
  } else if (detailType !== "default") {
    mergedAttributes.heroStyles = {
      mediumSquare: squareHero,
      mediumLandscape: heroBackground,
      largeLandscape: heroBackground
    };
    mergedAttributes.heroLayout = detailType;
  }

  return {
    attributes: Object.assign(projectCollection.attributes, mergedAttributes),
    relationships: projectCollection.relationships
  };
}

function Context(props) {
  return <div className="browse container">{props.children}</div>;
}

storiesOf("Frontend/ProjectCollection", module)
  .add("Default", () => {
    const authenticated = boolean("Authenticated", true);
    const limit = number("Project limit", 5);
    const invertColor = boolean("Invert Color", false);

    const bannerOptions = {
      default: "default",
      "custom icon": "customIcon",
      "square hero": "square_inset",
      "medium size hero": "wide_inset",
      "large size hero": "full_bleed"
    };

    const detailType = select(
      "Collection Banner Type",
      bannerOptions,
      "default"
    );

    const projectCollectionWithImages = createProjectCollectionWithImages(
      detailType
    );

    return (
      <Context>
        <Summary
          projectCollection={projectCollectionWithImages}
          invertColor={invertColor}
          limit={limit}
          authentication={{ authenticated }}
        />
      </Context>
    );
  })
  .add("Detail", () => {
    const authenticated = boolean("Authenticated", true);
    const bannerOptions = {
      default: "default",
      "custom icon": "customIcon",
      "square hero": "square_inset",
      "medium size hero": "wide_inset",
      "large size hero": "full_bleed"
    };

    const detailType = select(
      "Collection Banner Type",
      bannerOptions,
      "default"
    );

    const projectCollectionWithImages = createProjectCollectionWithImages(
      detailType
    );

    return (
      <Context>
        <Detail
          projectCollection={projectCollectionWithImages}
          projects={projects}
          authentication={{ authenticated }}
          pagination={pagination}
          paginationClickHandler={() => null}
        />
      </Context>
    );
  });
