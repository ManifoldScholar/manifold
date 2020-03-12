import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import Form from "../Form";

const project = fixtures.factory("project");
const category = fixtures.factory("category", { relationships: { project } });

storiesOf("Backend/Category", module).add("Form", () => {
  return <Form model={category} />;
});
