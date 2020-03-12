import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import Annotation from "global/components/Annotation";

const annotations = fixtures.collectionFactory("annotation", 8);

storiesOf("Global/Annotation/List", module)
  .add("Default", () => {
    return (
      <div style={{ backgroundColor: "white" }}>
        <Annotation.List.Default
          annotations={annotations}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  })
  .add("GroupedBySelection", () => {
    return (
      <div style={{ backgroundColor: "white" }}>
        <Annotation.List.GroupedBySelection
          annotations={annotations}
          saveAnnotation={() => console.log("annotation saved")}
          loginHandler={() => console.log("login triggered")}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  })
  .add("GroupedBySection", () => {
    return (
      <div style={{ backgroundColor: "white" }}>
        <Annotation.List.GroupedBySection
          groupedAnnotations={[
            {
              name: "A Section",
              sectionId: "111",
              annotations
            },
            {
              name: "Another Section",
              sectionId: "222",
              annotations
            }
          ]}
          saveAnnotation={() => console.log("annotation saved")}
          loginHandler={() => console.log("login triggered")}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  });
