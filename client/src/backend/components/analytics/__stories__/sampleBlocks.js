import React from "react";
import { fixtures } from "helpers/storybook/exports";
import { text, select } from "@storybook/addon-knobs";

export const chart = {
  icon: "featureExplore32",
  title: "Visitors",
  description: (
    <p>
      <span style={{ color: "var(--analytics-highlight-color" }}>316</span>{" "}
      unique visitors in the last 30 days
    </p>
  )
};

export const figure = {
  icon: select(
    "Icon",
    {
      Reload: "reload32",
      Bookmark: "bookmark32",
      Comment: "commentPencil32"
    },
    "reload32"
  ),
  title: text("Title", "Return Visits"),
  stat: text("Stat", "87%"),
  caption: text("Caption", "274 of 316 visitors were making a return visit")
};

export const figureList = {
  icon: "interactAnnotate32",
  title: "Annotations",
  figures: [
    {
      stat: "623",
      caption: "Annotations created in the last 30 days"
    },
    {
      stat: "461",
      caption: "Public"
    },
    {
      stat: "162",
      caption: "Private"
    },
    {
      stat: "224",
      caption: "in Reading Groups"
    }
  ]
};

export const time = {
  title: text("Title", "Average Visit")
};

export const list = {
  icon: "featureMeasure32",
  title: "Site Statistics",
  description: "Your Manifold installation’s content and user activity.",
  items: [
    {
      icon: "projects64",
      label: "Projects",
      value: 80
    },
    {
      icon: "textsBook64",
      label: "Texts",
      value: 179
    },
    {
      icon: "BEResourcesBoxes64",
      label: "Resources",
      value: 98
    },
    {
      icon: "users32",
      label: "Users",
      value: 38
    },
    {
      icon: "interactAnnotate32",
      label: "Annotations",
      value: 103
    },
    {
      icon: "interactComment32",
      label: "Comments",
      value: 26
    }
  ]
};

export const table = {
  icon: "search32",
  title: "Top Searches",
  headers: ["Search Term", "Search Count"],
  rows: [
    {
      id: 1,
      label: "Search term here",
      value: 17
    },
    {
      id: 2,
      label: "Search term here",
      value: 8
    },
    {
      id: 3,
      label: "Search term here",
      value: 7
    },
    {
      id: 4,
      label: "Search term here",
      value: 5
    },
    {
      id: 5,
      label: "Search term here",
      value: 2
    }
  ],
  allLink: "testUrl"
};

export const projectTable = {
  icon: "eyeOpen32",
  title: "Most Viewed Projects",
  headers: ["Project", "Visits"],
  rows: fixtures.collectionFactory("project", 5),
  pagination: fixtures.pagination(),
  sortOptions: [
    {
      key: "most_visited_desc",
      value: "most_visited_desc",
      label: "Most visited at the top"
    },
    {
      key: "most_visited_asc",
      value: "most_visited_asc",
      label: "Most visited at the bottom"
    }
  ]
};

export const textNodeTable = {
  icon: "eyeOpen32",
  title: "Text Visitors",
  headers: ["Section Title", "View Count"],
  text: fixtures.factory("text")
};
