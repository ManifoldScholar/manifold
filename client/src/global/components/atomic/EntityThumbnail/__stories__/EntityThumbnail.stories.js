import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityThumbnail from "..";

const issue = fixtures.entities.issue();

storiesOf("Global/EntityThumbnail", module)
  .add("Journal Issue", () => {
    return (
      <div style={{ maxWidth: "300px" }} className="bg-white">
        <EntityThumbnail
          entity={issue.data}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
          stack
        />
      </div>
    );
  })
  .add("Recently Updated", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true };
    return (
      <div style={{ maxWidth: "300px" }} className="bg-white">
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
        />
      </div>
    );
  })
  .add("Draft", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true, draft: true };
    return (
      <div style={{ maxWidth: "300px" }} className="bg-white">
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
        />
      </div>
    );
  })
  .add("With Non-primary Color", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, avatarColor: "quinary" };
    return (
      <div style={{ maxWidth: "300px" }} className="bg-white">
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
        />
      </div>
    );
  })
  .add("No Subtitle", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, subtitle: null };
    return (
      <div style={{ maxWidth: "300px" }} className="bg-white">
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
        />
      </div>
    );
  })
  .add("Side-by-Side", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true, draft: true };
    return (
      <div className="bg-white">
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          hideDesc
          stack={false}
        />
      </div>
    );
  });
