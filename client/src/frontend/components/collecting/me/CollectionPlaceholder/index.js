import React from "react";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import CollectingAnimation from "./Animation";

function CollectionPlaceholder() {
  const actions = [
    {
      children: (
        <Link to={lh.link("frontendProjects")} className="button-tertiary">
          Browse Projects
        </Link>
      )
    }
  ];
  return (
    <ContentPlaceholder.Wrapper context="frontend">
      <ContentPlaceholder.Title>
        You haven’t starred any items … yet.
      </ContentPlaceholder.Title>
      <ContentPlaceholder.Body>
        <p>
          But don’t fret, we’ve made it easy. Anywhere you see an empty star
          icon, just select it to add that item to your collection. You can star
          all kinds of items, so start browsing projects and get starring!
        </p>
        <CollectingAnimation />
      </ContentPlaceholder.Body>
      <ContentPlaceholder.Actions actions={actions} />
    </ContentPlaceholder.Wrapper>
  );
}

CollectionPlaceholder.displayName = "Collecting.Me.CollectionPlaceholder";

export default CollectionPlaceholder;
