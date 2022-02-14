import React from "react";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Animation from "./Animation";
import { Actions, Body, Title, Wrapper } from "../../parts";

function MyStarredPlaceholder() {
  return (
    <Wrapper>
      <Title>You haven’t starred any items … yet.</Title>
      <Body>
        <p>
          But don’t fret, we’ve made it easy. Anywhere you see an empty star
          icon, just select it to add that item to your collection. You can star
          all kinds of items, so start browsing projects and get starring!
        </p>
        <Animation />
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Link
                to={lh.link("frontendProjects")}
                className="button-tertiary"
              >
                Browse Projects
              </Link>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

MyStarredPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.MyStarred";

export default MyStarredPlaceholder;
