import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import cloneDeep from "lodash/cloneDeep";
import Results from "../List";

const project = build.arrayOf.projects(1)[0];
const user = build.arrayOf.users(1)[0];
user.attributes.avatarStyles = {};
const userB = cloneDeep(user);
userB.attributes.fullName = "Johnson McWortles";
userB.attributes.firstName = "Johnson";
userB.attributes.lastName = "McWortles";
userB.attributes.avatarStyles = build.image();
const annotation = build.entity.annotation(1, {
  createdAt: new Date(1987, 12, 10).toString()
});
annotation.relationships.creator = user;
project.relationships.creators = [user];

const annotationResult = {
  attributes: {
    searchableType: "annotation",
    highlights: {
      fullText: ["foo bar florps glorps"]
    },
    parents: {
      text: "123",
      textSection: "456"
    }
  },
  relationships: {
    model: annotation
  }
};

const annotationResultB = cloneDeep(annotationResult);
annotationResultB.relationships.model.relationships.creator = userB;

const projectResult = {
  attributes: {
    searchableType: "project",
    highlights: {
      title: [project.attributes.title],
      fullText: ["foo bar florps glorps"]
    },
    parents: {}
  },
  relationships: {
    model: project
  }
};

const pagination = {
  perPage: 2,
  currentPage: 1,
  nextPage: 2,
  prevPage: 0,
  totalPages: 2,
  totalCount: 4
};

const results = [annotationResult, annotationResultB, projectResult];
storiesOf("Global/Search", module).add("Results", () => {
  return (
    <Results
      results={results}
      pagination={pagination}
      paginationClickHandler={() => {}}
      context="frontend"
    />
  );
});
