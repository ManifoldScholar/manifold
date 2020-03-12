import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import Results from "../List";
import cloneDeep from "lodash/cloneDeep";

const project = fixtures.factory("project");
const user = fixtures.factory("user");
user.attributes.avatarStyles = {};
const userB = cloneDeep(user);
userB.attributes.fullName = "Johnson McWortles";
userB.attributes.firstName = "Johnson";
userB.attributes.lastName = "McWortles";
userB.attributes.avatarStyles = fixtures.imageStyles();
const annotation = fixtures.factory("annotation");
annotation.relationships.creator = user;
project.relationships.creators = [user];

const annotationResult = {
  id: 1,
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
annotationResultB.id = 2;
annotationResultB.relationships.model.relationships.creator = userB;

const projectResult = {
  id: 3,
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

const pagination = fixtures.pagination();

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
