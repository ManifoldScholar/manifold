import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import Annotation from "global/components/Annotation";


storiesOf("Global/Annotation/List", module)
  .add("Default", () => {
    return (
      <div style={{backgroundColor: "white"}}>
        <Annotation.List.Default
          annotations={build.arrayOf.annotations(8, true)}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  })
  .add("GroupedBySelection", () => {
    return (
      <div style={{backgroundColor: "white"}}>
        <Annotation.List.GroupedBySelection
          annotations={build.arrayOf.annotations(8, false)}
          saveAnnotation={() => console.log("annotation saved")}
          loginHandler={() => console.log("login triggered")}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  })
  .add("GroupedBySection", () => {
    return (
      <div style={{backgroundColor: "white"}}>
        <Annotation.List.GroupedBySection
          groupedAnnotations={[
            {
            name: "A Section",
            sectionId: "111",
            annotations: build.arrayOf.annotations(4, true)
            },
            {
              name: "Another Section",
              sectionId: "222",
              annotations: build.arrayOf.annotations(4, true)
            }
          ]}
          saveAnnotation={() => console.log("annotation saved")}
          loginHandler={() => console.log("login triggered")}
          dispatch={() => console.log("dispatched")}
        />
      </div>
    );
  });


