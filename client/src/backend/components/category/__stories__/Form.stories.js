import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import Form from "../Form";

const project = build.entity.project;
const category = build.entity.category(null, {}, { project });

storiesOf("Backend/Category", module).add("Form", () => {
  return <Form model={category} />;
});
