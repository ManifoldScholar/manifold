import React from "react";
import { Actions, Body, Title, Wrapper } from "../parts";

function MyAnnotationsPlaceholder() {
  return (
    <Wrapper context="frontend">
      <Title icon="notes24">Create your first annotation!</Title>
      <Body>
        <p>
          While reading, add your notes and annotations to the text. Save them
          privately, or associate them with a reading group.
        </p>
      </Body>
      <Actions />
    </Wrapper>
  );
}

MyAnnotationsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.MyAnnotations";

export default MyAnnotationsPlaceholder;
