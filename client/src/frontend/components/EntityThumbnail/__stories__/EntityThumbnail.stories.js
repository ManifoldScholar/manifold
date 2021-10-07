import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityThumbnail from "frontend/components/EntityThumbnail";

const issue = fixtures.entities.issue();
const user = fixtures.entities.user();

storiesOf("Frontend/EntityThumbnail", module)
  .add("Journal Issue", () => {
    return (
      <EntityThumbnail
        entity={issue.data}
        onUncollect={() => console.log("clicked (un)collect")}
        userMock={user.attributes}
        hideDesc
      />
    );
  })
  .add("Recently Updated", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true };
    return (
      <EntityThumbnail
        entity={{ ...issue.data, attributes: updated }}
        onUncollect={() => console.log("clicked (un)collect")}
        userMock={user.attributes}
        hideDesc
      />
    );
  })
  .add("Draft", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true, draft: true };
    return (
      <EntityThumbnail
        entity={{ ...issue.data, attributes: updated }}
        onUncollect={() => console.log("clicked (un)collect")}
        userMock={user.attributes}
        hideDesc
      />
    );
  })
  .add("With Non-primary Color", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, avatarColor: "quinary" };
    return (
      <EntityThumbnail
        entity={{ ...issue.data, attributes: updated }}
        onUncollect={() => console.log("clicked (un)collect")}
        userMock={user.attributes}
        hideDesc
      />
    );
  })
  .add("No Subtitle", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, subtitle: null };
    return (
      <EntityThumbnail
        entity={{ ...issue.data, attributes: updated }}
        onUncollect={() => console.log("clicked (un)collect")}
        userMock={user.attributes}
        hideDesc
      />
    );
  });
