import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityThumbnail from "frontend/components/EntityThumbnail";
import * as Styled from "../EntityThumbnail.styles";

const issue = fixtures.entities.issue();
const user = fixtures.entities.user();

storiesOf("Frontend/EntityThumbnail", module)
  .add("Journal Issue", () => {
    return (
      <Styled.EntityListItemWrapper>
        <EntityThumbnail
          entity={issue.data}
          onUncollect={() => console.log("clicked (un)collect")}
          userMock={user.attributes}
          hideDesc
        />
      </Styled.EntityListItemWrapper>
    );
  })
  .add("Recently Updated", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true };
    return (
      <Styled.EntityListItemWrapper>
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          userMock={user.attributes}
          hideDesc
        />
      </Styled.EntityListItemWrapper>
    );
  })
  .add("Draft", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, recentlyUpdated: true, draft: true };
    return (
      <Styled.EntityListItemWrapper>
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          userMock={user.attributes}
          hideDesc
        />
      </Styled.EntityListItemWrapper>
    );
  })
  .add("With Non-primary Color", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, avatarColor: "quinary" };
    return (
      <Styled.EntityListItemWrapper>
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          userMock={user.attributes}
          hideDesc
        />
      </Styled.EntityListItemWrapper>
    );
  })
  .add("No Subtitle", () => {
    const attrs = issue.data.attributes;
    const updated = { ...attrs, subtitle: null };
    return (
      <Styled.EntityListItemWrapper>
        <EntityThumbnail
          entity={{ ...issue.data, attributes: updated }}
          onUncollect={() => console.log("clicked (un)collect")}
          userMock={user.attributes}
          hideDesc
        />
      </Styled.EntityListItemWrapper>
    );
  });
