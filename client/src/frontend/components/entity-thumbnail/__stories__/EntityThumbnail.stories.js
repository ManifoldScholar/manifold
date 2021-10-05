import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityThumbnail from "../EntityThumbnail";

const issue = fixtures.entities.issue();
const user = fixtures.entities.user();

storiesOf("Frontend/EntityThumbnail", module).add("Journal Issue", () => {
  console.log(user);
  return (
    <EntityThumbnail
      entity={issue.data}
      onUncollect={() => console.log("clicked (un)collect")}
      user={user.attributes}
    />
  );
});
