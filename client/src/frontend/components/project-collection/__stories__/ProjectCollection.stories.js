import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { boolean, number, select, text } from "@storybook/addon-knobs";
import ProjectCollection from "../index";

import iconSVG from "test/assets/icon.png";
import heroBackground from "test/assets/hero-bg.jpg";
import squareHero from "test/assets/hero-square.jpg";

const { Summary, Detail } = ProjectCollection;

const projects = fixtures.collectionFactory("project");
const collectionProjects = fixtures.collectionFactory("collectionProject");
const projectCollection = fixtures.factory("projectCollection", {
  relationships: { collectionProjects, subjects: [], projects }
});
const pagination = fixtures.pagination();

const defaultDescription = projectCollection.attributes.descriptionFormatted;

const iconOptions = {
  none: null,
  lamp: "lamp",
  "book stack vertical": "book-stack-vertical",
  "new round": "new-round",
  "books on shelf": "books-on-shelf",
  globe: "globe",
  touch: "touch",
  mug: "mug"
};

const bannerOptions = {
  default: "default",
  "custom icon": "customIcon",
  "square hero": "square_inset",
  "medium size hero": "wide_inset",
  "large size hero": "full_bleed"
};

// eslint-disable-next-line prettier/prettier
function createProjectCollectionWithImages(detailType, icon, description, title) {
  const mergedAttributes = {
    iconStyles: null,
    heroStyles: null,
    heroLayout: null,
    icon,
    descriptionFormatted: description ? defaultDescription : null,
    title
  };

  if (detailType === "customIcon") {
    mergedAttributes.iconStyles = { square: iconSVG };
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
  return <div className="browse">{props.children}</div>;
}

/* ********** Stories ********** */

storiesOf("Frontend/ProjectCollection", module)
  .add("Summary", () => {
    const authenticated = boolean("Authenticated", true);
    const limit = number("Project limit", 5);
    const invertColor = boolean("Invert Color", false);
    const description = boolean("Show Description", true);
    const title = text("Text", "A Project Collection");
    const detailType = select("Type", bannerOptions, "default");
    const iconType = select("Icon", iconOptions, "lamp");

    const projectCollectionWithImages = createProjectCollectionWithImages(
      detailType,
      iconType,
      description,
      title
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
    const description = boolean("Show Description", true);
    const title = text("Text", "A Project Collection");
    const detailType = select("Type", bannerOptions, "default");
    const iconType = select("Icon", iconOptions, "lamp");

    const projectCollectionWithImages = createProjectCollectionWithImages(
      detailType,
      iconType,
      description,
      title
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
